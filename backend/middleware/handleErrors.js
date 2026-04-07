module.exports = (error, request, response, next) => {
  console.error(error);
  if (error.name === "CastError") {
    response.status(400).send({ error: "id used malformed" });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  else {
    response.status(500).end();
  }
}