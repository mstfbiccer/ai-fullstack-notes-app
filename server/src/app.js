import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

// In-memory notes store
const notes = [
  { id: 1, title: 'Welcome', content: 'This is your first note!' }
];
let nextId = 2;

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const { title, content } = req.body || {};
  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' });
  }
  const newNote = { id: nextId++, title, content };
  notes.push(newNote);
  res.status(201).json(newNote);
});

export default app;
