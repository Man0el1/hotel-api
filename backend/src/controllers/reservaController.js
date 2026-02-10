import { Op } from "sequelize";
import { Quarto } from "../models/quartoModel.js";
import { Reserva } from "../models/reservaModel.js";
import { ReservaQuarto } from '../models/reservaQuartoModel.js';

export const getAvalibility = async (req, res) => {
  try {
    const {checkin, checkout} = req.body;
    const disponibilidade = {}
    const disponibilidadeFumante = {}
    const disponibilidadeFrente = {}

    if (!checkin || !checkout) return res.status(400).json({ message: "Datas obrigatórias" });
    if (new Date(checkout) <= new Date(checkin)) return res.status(400).json({ message: "Checkout inválido" });

    const reservasOcupadas = await Reserva.findAll({
      where: {
        check_in: { [Op.lt]: checkout },
        check_out: { [Op.gt]: checkin }
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
      }
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

    return res.status(200).json({ disponibilidade, disponibilidadeFumante, disponibilidadeFrente });
  } catch (e) {
    return res.status(500).json({ message: "Erro ao obter disponibilidade: " + e.message });
  }
}
