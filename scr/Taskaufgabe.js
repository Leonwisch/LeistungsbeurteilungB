const express = require('express');
const app = express();
const { randomUUID } = require('node:crypto');
const port = 3000;

app.use(express.json());

let tasks = [
  {id: "1", task: "Football" },
  {id: "2", task: "Basketball" },
  {id: "3", task: "Tennis" },
  {id: "4", task: "Schwimmen" },
  {id: "5", task: "Laufen" },
  {id: "6", task: "Radfahren" },
  {id: "7", task: "Wandern" },
  {id: "8", task: "Yoga" },
  {id: "9", task: "Gewichtheben" },
  {id: "10", task: "Boxen" },
];

app.get('/tasks', (request, response) => {
  response.status(200).send(tasks);
});

app.post('/tasks', (request, response) => {
  const newTask = request.body;
  newTask['id'] = randomUUID();
    tasks = [...tasks, newTask];
    response.status(201).send(tasks);
  });

app.get('/task/:id', (request, response) => {
  const task = tasks.find((task) => task.id === request.params.id);
  if (task) {
    response.status(200).json(task);
  } else {
    response.status(404).json({ error: 'Task not found' });
  }
});

app.patch('/task/:id', (request, response) => {
  const keys = Object.keys(request.body);
  const id = request.params.id

  if(id in tasks){
  const oldtask = tasks.find((task) => String(task.id) === id);
  keys.forEach((key) => oldtask[key] = request.body[key]);
  tasks = tasks.map((task) => task.id === id ? oldtask : task);
  response.send(tasks);
  } else {
    return response.status(404).send("Id not found")
  }
});

app.delete('/task/:id', (request, response) => {
  const id = request.params.id

  if (id in tasks) {
    tasks = tasks.filter((task) => task.id !== request.params.id);
    response.status(200).send(tasks);
  } else {
    response.status(404).json({ error: 'Id not found' });
  }
});

app.listen(port, () => {
  console.log(`Task app listening on port ${port}`);
});