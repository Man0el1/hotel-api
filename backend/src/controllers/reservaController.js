import { Op } from "sequelize";
import { Quarto } from "../models/quartoModel.js";
import { Reserva } from "../models/reservaModel.js";
import { ReservaQuarto } from '../models/reservaQuartoModel.js';

const getAvailableRooms = async (checkin, checkout, t) => {
  try {
    if (!checkin || !checkout) throw new Error("Check-in e check-out são obrigatórios");
    if (new Date(checkout) <= new Date(checkin)) throw new Error("Check-out deve ser depois do check-in");

    const disponibilidade = {};
    const disponibilidadeFumante = {};
    const disponibilidadeFrente = {};

    const reservasOcupadas = await Reserva.findAll({
      where: {
        check_in: { [Op.lt]: checkout },
        check_out: { [Op.gt]: checkin },
        status: { [Op.not]: "cancelada" }
      },
      include: {
        model: Quarto,
        attributes: ['id_quarto', 'tipo'],
        through: { attributes: [] } // relacionamentos (n:n), não trazer atributos da tabela intermediária
      }
    });

    const IdQuartosReservados = new Set();

    reservasOcupadas.forEach(reserva => {
      reserva.Quartos.forEach(quarto => {
        IdQuartosReservados.add(quarto.id_quarto);
      });
    });

    const quartosDisponiveis = await Quarto.findAll({
      where: {
        id_quarto: {[Op.notIn]: [...IdQuartosReservados]}
      },
      transaction: t,
      lock: true
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
  try {
    const t = await sequelize.transaction();

    const {checkin, checkout} = req.body;
    const [disponibilidade, disponibilidadeFumante, disponibilidadeFrente] = await getAvailableRooms(checkin, checkout, t);

    return res.status(200).json({ disponibilidade, disponibilidadeFumante, disponibilidadeFrente});
  } catch (e) {
    return res.status(500).json({ message: "Erro ao obter disponibilidade: " + e.message });
  }
}

export const createPreConfirmation = async (req, res) => {
  try {
    const t = await sequelize.transaction();

    const { checkin, checkout, tiposDeQuarto } = req.body;
    let quartosSelecionados = new Set();
    let valorTotal = 0;
    const dias = Math.round((new Date(checkout) - new Date(checkin)) / 86400000);

    const [
      disponibilidade,
      disponibilidadeFumante,
      disponibilidadeFrente,
      quartosDisponiveis,
    ] = await getAvailableRooms(checkin, checkout, t);

    let idsDisponiveis = quartosDisponiveis.map(quarto => quarto.id_quarto);

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

    for (const quarto of tiposDeQuarto) {
      while (quarto.contador > 0) {

        while (quarto.contadorFumante > 0) {
          const quartoFumante = quartosDisponiveis.find(
            q => idsDisponiveis.includes(q.id_quarto) && q.tipo === quarto.tipo && q.is_smoker
          );
          if (!quartoFumante) throw new Error("Sem quartos suficientes");
          quartosSelecionados.add(quartoFumante.id_quarto);
          idsDisponiveis = idsDisponiveis.filter( id => id !== quartoFumante.id_quarto );

          quarto.contadorFumante--;
          quarto.contador--;
        }

        while (quarto.contadorFrente > 0) {
          const quartoFrente = quartosDisponiveis.find(
            q => idsDisponiveis.includes(q.id_quarto) && q.tipo === quarto.tipo && q.is_front_view
          );
          if (!quartoFrente) throw new Error("Sem quartos suficientes");
          quartosSelecionados.add(quartoFrente.id_quarto);
          idsDisponiveis = idsDisponiveis.filter( id => id !== quartoFrente.id_quarto );

          quarto.contadorFrente--;
          quarto.contador--;
        }

        if (quarto.contador <= 0) break;
        const temQuartoSemVista = idsDisponiveis.some(id => {
          const q = quartosDisponiveis.find(x => x.id_quarto === id);
          return q.tipo === quarto.tipo && !q.is_front_view;
        });

        const quartoNormal = quartosDisponiveis.find(q =>
          idsDisponiveis.includes(q.id_quarto)
          && q.tipo === quarto.tipo
          && !(q.is_smoker)
          && (!q.is_front_view || temQuartoSemVista)
        );

        if (!quartoNormal) throw new Error("Sem quartos suficientes");
        quartosSelecionados.add(quartoNormal.id_quarto);
        idsDisponiveis = idsDisponiveis.filter( id => id !== quartoNormal.id_quarto );

        quarto.contador--;
      }
    };

    try {
      const reserva = await Reserva.create({
        id_conta: req.userId,
        check_in: checkin,
        check_out: checkout,
        status: "pendente"
      }, { transaction: t });

      await reserva.addQuartos([...quartosSelecionados], { transaction: t });

      await t.commit();
      return res.status(200).json({ reservaId: reserva.id_reserva, valorTotal });
    } catch (e) {
      await t.rollback();
      return res.status(500).json({ message: "Erro ao criar pré-confirmação: " + e.message });
    }

  } catch (e) {
    return res.status(500).json({ message: "Erro ao criar pré-confirmação: " + e.message });
  }
}
