const express = require('express');
const bodyParser = require('body-parser');
require('./DbConfig/dbConfig')
const Task = require("./DbConfig/apiSchema")

const app = express();
const cors = require("cors");
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// API endpoints
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/tasks', async (req, res) => {
  const { title, description } = req.body;
  const task = new Task({ title, description, completed: false });

  try {
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.patch('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const { completed } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { completed },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
