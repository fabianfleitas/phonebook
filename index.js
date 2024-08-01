const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static("dist"));

morgan.token("type", function (req) {
  if (req.method == "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :type")
);
app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => next(err));
});

app.get("/info", (req, res, next) => {
  Person.countDocuments()
    .then((count) => {
      const actualDate = new Date();
      res.send(
        `<div><p>Phonebook has info for ${count} people</p><p>${actualDate}</p></div>`
      );
    })
    .catch((err) => next(err));
});

app.post("/api/persons", (request, response, next) => {
  const { name, number } = request.body;
  let error = "";

  if (!name) {
    error = "enter a valid name";
  }

  if (!number) {
    error = "enter a valid number";
  }

  if (error) {
    return response.status(400).json({ error });
  }

  Person.findOne({ name })
    .then((person) => {
      if (person) {
        return response.status(400).json({ error: "name must be unique" });
      } else {
        const newPerson = new Person({ name, number });
        return newPerson
          .save()
          .then((savedPerson) => {
            if (savedPerson) {
              console.log(savedPerson);
              response.status(201).json(savedPerson.toObject()); // 201 Created
            }
          })
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const { name, number } = req.body;
  let error = "";

  if (!name) {
    error = "enter a valid name";
  }

  if (!number) {
    error = "enter a valid number";
  }

  if (error) {
    return res.status(400).json({ error });
  }

  const updatedPerson = { name, number };

  Person.findByIdAndUpdate(id, updatedPerson, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((person) => {
      res.json(person);
    })
    .catch((err) => next(err));
});

//errors
const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

app.use(errorHandler);
const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
