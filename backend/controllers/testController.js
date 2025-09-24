export const index = (req, res) => {
  res.status(200).json({
    tshirt: '👕',
    size: 'large'
  });
};

export const id_index = (req, res) => { // example: localhost:8080/tshirt/123
  const { id } = req.params;
  const { logo } = req.body;
  if(!logo) {
    res.status(418).json({ message: 'We need a logo!' });
  } else {
    res.status(200).json({
      tshirt: `👕 with ${logo} and id: ${id}`,
    });
  }
}
