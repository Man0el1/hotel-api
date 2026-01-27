export const getCurrentDate = async (req, res) => {
  try {
    const currentDate = new Date()
    const oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    const formattedCurrentDate = currentDate.toISOString().split('T')[0];
    const formattedOneYearLater = oneYearLater.toISOString().split('T')[0];
    return res.status(200).json({ dataAtual: formattedCurrentDate, dataAnoSeguinte: formattedOneYearLater });
  } catch (e) {
    return res.status(500).json({ message: "Erro ao obter data atual." });
  }
}
