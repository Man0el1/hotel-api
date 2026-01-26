export const getCurrentDate = async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0];
    return res.status(200).json({ dataAtual: currentDate });
  } catch (e) {
    return res.status(500).json({ message: "Erro ao obter data atual." });
  }
}
