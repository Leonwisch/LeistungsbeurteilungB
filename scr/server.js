/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable spaced-comment */
const express = require('express');

const app = express();
const { randomUUID } = require('node:crypto');
const session = require('express-session');
const validator = require("email-validator");
// eslint-disable-next-line import/no-extraneous-dependencies
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const port = 3000;

app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {},
}));

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

const secretAdminCredentials = { email: "desk@library.example", password: "m295" };

//Beispiele wurden mit ChatGPT erstellt
let tasks = [
  {
    id: "1", task: "Football", author: "Leon", creationDate: "12.12.2023", fulfillmentDate: "13.12.2023",
  },
  {
    id: "2", task: "Task 2", author: "Author 2", creationDate: "13.12.2023", fulfillmentDate: "14.12.2023",
  },
  {
    id: "3", task: "Task 3", author: "Author 3", creationDate: "14.12.2023", fulfillmentDate: "15.12.2023",
  },
  {
    id: "4", task: "Task 4", author: "Author 4", creationDate: "15.12.2023", fulfillmentDate: "16.12.2023",
  },
  {
    id: "5", task: "Task 5", author: "Author 5", creationDate: "16.12.2023", fulfillmentDate: "17.12.2023",
  },
  {
    id: "6", task: "Task 6", author: "Author 6", creationDate: "17.12.2023", fulfillmentDate: "18.12.2023",
  },
  {
    id: "7", task: "Task 7", author: "Author 7", creationDate: "18.12.2023", fulfillmentDate: "19.12.2023",
  },
  {
    id: "8", task: "Task 8", author: "Author 8", creationDate: "19.12.2023", fulfillmentDate: "20.12.2023",
  },
  {
    id: "9", task: "Task 9", author: "Author 9", creationDate: "20.12.2023", fulfillmentDate: "21.12.2023",
  },
  {
    id: "10", task: "Task 10", author: "Author 10", creationDate: "21.12.2023", fulfillmentDate: "22.12.2023",
  },
];

// Login
app.post('/login', (request, response) => {
  const { email, password } = request.body;

  // eslint-disable-next-line eqeqeq
  if (validator.validate(email) && password == secretAdminCredentials.password) {
    request.session.email = email;
    return response.status(200).json({ email: request.session.email });
  }

  return response.status(401).json({ error: "Invalid credentials" });
});

app.get('/verify', (request, response) => {
  if (request.session.email) {
    return response.status(200).json({ email: request.session.email });
  }

  return response.status(401).json({ error: "Not logged in" });
});

app.delete('/logout', (request, response) => {
  if (request.session.email) {
    request.session.email = null;
    return response.status(204).send();
  }

  return response.status(401).json({ error: "Not logged in" });
});

// Tasks
app.get('/tasks', (request, response) => {
  if (request.session.email) {
    return response.status(200).send(tasks);
  }
  return response.status(401).json({ error: "Not logged in" });
});

app.post('/tasks', (request, response) => {
  if (request.session.email) {
    const newTask = request.body;
    newTask.id = randomUUID();
    tasks = [...tasks, newTask];
    return response.status(201).send(tasks);
  }
  return response.status(401).json({ error: "Not logged in" });
});

app.get('/task/:id', (request, response) => {
  if (request.session.email) {
    // eslint-disable-next-line no-shadow
    const task = tasks.find((task) => task.id === request.params.id);
    if (task) {
      response.status(200).json(task);
    } else {
      response.status(404).json({ error: 'Task not found' });
    }
  }
  return response.status(401).json({ error: "Not logged in" });
});

app.patch('/task/:id', (request, response) => {
  if (request.session.email) {
    const keys = Object.keys(request.body);
    const { id } = request.params;

    if (id in tasks) {
      const oldtask = tasks.find((task) => String(task.id) === id);
      // eslint-disable-next-line no-return-assign
      keys.forEach((key) => oldtask[key] = request.body[key]);
      tasks = tasks.map((task) => (task.id === id ? oldtask : task));
      response.send(tasks);
    } else {
      return response.status(404).send("Id not found");
    }
  }
  return response.status(401).json({ error: "Not logged in" });
});

app.delete('/task/:id', (request, response) => {
  if (request.session.email) {
    const { id } = request.params;

    if (id in tasks) {
      tasks = tasks.filter((task) => task.id !== request.params.id);
      response.status(200).send(tasks);
    } else {
      response.status(404).json({ error: 'Id not found' });
    }
  }
  return response.status(401).json({ error: "Not logged in" });
});

// Server
app.listen(port, () => {
  console.log(`Task app listening on port ${port}`);
});
