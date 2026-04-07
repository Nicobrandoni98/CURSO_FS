require("dotenv").config();
require("./mongo");

const express = require("express");
const app = express();
const cors = require("cors");
const Note = require("./models/Note");
const notFound = require("./middleware/notFound");
const handleErrors = require("./middleware/handleErrors");

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;

  Note.findById(id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((err) => {
      next(err);
    });
});

app.delete("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;

  Note.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/notes/:id", (request, response, next) => {
  const { content, important } = request.body;

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: "query" },
  )
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

app.post("/api/notes", (request, response, next) => {
  const note = request.body;

  if (!note.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false,
  });
  newNote
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));
});

app.use(notFound);

app.use(handleErrors);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
