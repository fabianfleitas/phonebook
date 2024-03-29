const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json());
app.use(express.static("dist"));

morgan.token("content", function getContent(req) {
  return Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : "";
});

app.use(
  morgan(":method :url :status :res[content-length] :response-time ms :content")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.get("/info", (req, res) => {
  const actualDate = new Date();
  res.send(
    `<div><p>Phonebook has info for ${persons.length} people</p><p>${actualDate}</p</div>`
  );
});

app.post("/api/persons", (req, res) => {
  const name = req.body.name;
  const number = req.body.number;

  if (!number) {
    return res.status(400).json({ error: "the attribute number is missing" });
  } else if (!name) {
    return res.status(400).json({ error: "the attribute name is missing" });
  }

  const person = persons.find(
    (person) => person.name.toLowerCase() === name.toLowerCase()
  );

  if (person) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 10000),
    name: name,
    number: number,
  };

  persons = [...persons, newPerson];
  res.json(newPerson);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const personsQuantity = persons.length;
  persons = persons.filter((person) => person.id !== id);

  if (persons.length < personsQuantity) {
    res.json({ id: id });
  } else {
    res.status(204).end();
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
