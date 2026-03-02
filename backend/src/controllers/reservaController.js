import { Op } from "sequelize";
import { Quarto } from "../models/quartoModel.js";
import { Reserva } from "../models/reservaModel.js";
import { ReservaQuarto } from '../models/reservaQuartoModel.js';
import sequelize from "../database/sequelize.js";

const parseDateLocal = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return new Date(year, month - 1, day);
};

const getAvailableRooms = async (checkin, checkout, t) => {
  try {
    if (!checkin || !checkout) throw new Error("Check-in e check-out são obrigatórios");
    if (new Date(checkout) <= new Date(checkin)) throw new Error("Check-out deve ser depois do check-in");

    const tiposExistentes = await Quarto.findAll({
      attributes: ['tipo'],
      group: ['tipo'],
      transaction: t
    });

    const disponibilidade = {};
    const disponibilidadeFumante = {};
    const disponibilidadeFrente = {};

    tiposExistentes.forEach(q => {
      disponibilidade[q.tipo] = 0;
      disponibilidadeFumante[q.tipo] = 0;
      disponibilidadeFrente[q.tipo] = 0;
    });

    const reservasOcupadas = await Reserva.findAll({
      where: {
        check_in: { [Op.lt]: checkout },
        check_out: { [Op.gt]: checkin },
        status: { [Op.notIn]: ["cancelada", "expirada"] }
      },
      include: {
        model: Quarto,
        attributes: ['id_quarto', 'tipo'],
        through: { attributes: [] } // relacionamentos (n:n), não trazer atributos da tabela intermediária
      },
      transaction: t
    });

    const idQuartosReservados = new Set();

    reservasOcupadas.forEach(reserva => {
      reserva.Quartos.forEach(quarto => {
        idQuartosReservados.add(quarto.id_quarto);
      });
    });

    const quartosDisponiveis = await Quarto.findAll({
      where: {
        id_quarto: { [Op.notIn]: [...idQuartosReservados] }
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    })

    quartosDisponiveis.forEach(quarto => {
      disponibilidade[quarto.tipo] = (disponibilidade[quarto.tipo] || 0) + 1;
      if (quarto.is_smoker) {
        disponibilidadeFumante[quarto.tipo] = (disponibilidadeFumante[quarto.tipo] || 0) + 1;
      }
      if (quarto.is_front_view) {
        disponibilidadeFrente[quarto.tipo] = (disponibilidadeFrente[quarto.tipo] || 0) + 1;
      }
    });

    return [ disponibilidade, disponibilidadeFumante, disponibilidadeFrente, quartosDisponiveis ];

  } catch (e) {
    throw new Error("Erro ao obter quartos disponíveis: " + e.message);
  }
};

export const getAvalibility = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {checkin, checkout} = req.body;
    const [disponibilidade, disponibilidadeFumante, disponibilidadeFrente, quartosDisponiveis] = await getAvailableRooms(checkin, checkout, t);

    await t.commit();
    return res.status(200).json({ disponibilidade, disponibilidadeFumante, disponibilidadeFrente, quartosDisponiveis});
  } catch (e) {
    await t.rollback();
    return res.status(500).json({ message: "Erro ao obter disponibilidade: " + e.message });
  }
}

export const createPreConfirmation = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { checkin, checkout, tiposDeQuarto } = req.body;
    let quartosSelecionados = new Set();
    let valorTotal = 0;
    const checkinDate = parseDateLocal(checkin);
    const checkoutDate = parseDateLocal(checkout);
    const dias = Math.ceil(
      (checkoutDate - checkinDate) / 86400000
    );

    const [
      disponibilidade,
      disponibilidadeFumante,
      disponibilidadeFrente,
      quartosDisponiveis,
    ] = await getAvailableRooms(checkin, checkout, t);

    tiposDeQuarto.forEach((quarto) => {
      if (
        quarto.contador > (disponibilidade[quarto.tipo] || 0) ||
        quarto.contadorFumante > (disponibilidadeFumante[quarto.tipo] || 0) ||
        quarto.contadorFrente > (disponibilidadeFrente[quarto.tipo] || 0)
      ) {
        throw new Error(`Quantidade de quartos do tipo ${quarto.tipo} excede a disponibilidade`);
      }

      if (quarto.contador > 0) {
        valorTotal += (quarto.preco * quarto.contador + quarto.contadorFrente * (0.1 * quarto.preco))* dias;
      };
    });

    const quartosPorTipo = {};

  quartosDisponiveis.forEach(q => {
    if (!quartosPorTipo[q.tipo]) {
      quartosPorTipo[q.tipo] = {
        frente: [],
        fumante: [],
        normal: []
      };
    }

    if (q.is_front_view) {
      quartosPorTipo[q.tipo].frente.push(q);
    } else if (q.is_smoker) {
      quartosPorTipo[q.tipo].fumante.push(q);
    } else {
      quartosPorTipo[q.tipo].normal.push(q);
    }
  });

    for (const quarto of tiposDeQuarto) {

      const grupo = quartosPorTipo[quarto.tipo];

      for (let i = 0; i < quarto.contadorFrente; i++) {
        const selecionado = grupo.frente.pop();
        if (!selecionado) throw new Error("Sem quartos frente suficientes");
        quartosSelecionados.add(selecionado.id_quarto);
      }

      for (let i = 0; i < quarto.contadorFumante; i++) {
        const selecionado = grupo.fumante.pop();
        if (!selecionado) throw new Error("Sem quartos fumante suficientes");
        quartosSelecionados.add(selecionado.id_quarto);
      }

      const restantes = quarto.contador - quarto.contadorFrente - quarto.contadorFumante;

      for (let i = 0; i < restantes; i++) {
        let selecionado = null;

        if (grupo.normal.length > 0) {
          selecionado = grupo.normal.pop();
        }
        else if (grupo.fumante.length > 0) {
          selecionado = grupo.fumante.pop();
        }
        else if (grupo.frente.length > 0) {
          selecionado = grupo.frente.pop();
        }

        if (!selecionado) {
          throw new Error("Sem quartos suficientes");
        }

        quartosSelecionados.add(selecionado.id_quarto);
      }
    }

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); //15 minutos

    try {
      const reserva = await Reserva.create({
        id_conta: req.user.id,
        check_in: checkinDate,
        check_out: checkoutDate,
        valor_total: valorTotal,
        status: "pendente",
        expires_at: expiresAt
      }, { transaction: t });

      await reserva.addQuartos([...quartosSelecionados], { transaction: t });

      await t.commit();
      return res.status(200).json({ idReserva: reserva.id_reserva, tiposDeQuarto });
    } catch (e) {
      await t.rollback();
      return res.status(500).json({ message: "Erro ao criar pré-confirmação 1: " + e.message });
    }

  } catch (e) {
    await t.rollback();
    return res.status(500).json({ message: "Erro ao criar pré-confirmação 2: " + e.message });
  }
}
