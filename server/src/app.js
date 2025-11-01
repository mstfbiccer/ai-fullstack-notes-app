import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

// In-memory fallback mode - checked at runtime
const memoryNotes = [
  { id: 1, title: 'Welcome', content: 'This is your first note!', completed: 0 }
];
let nextId = 2;

// Function to check memory mode dynamically
function isMemoryMode() {
  return process.env.USE_MEMORY_MODE === 'true';
}

// Default user_id for demo purposes
const DEFAULT_USER_ID = 1;

app.get('/api/notes', async (req, res) => {
  try {
    if (isMemoryMode()) {
      return res.json(memoryNotes);
    }

    const { executeQuery } = await import('./db.js');
    const result = await executeQuery(
      `SELECT id, user_id, title, content, completed, created_at, updated_at 
       FROM notes 
       WHERE user_id = :user_id 
       ORDER BY created_at DESC`,
      { user_id: DEFAULT_USER_ID }
    );

    const notes = result.rows.map(row => ({
      id: row.ID,
      userId: row.USER_ID,
      title: row.TITLE,
      content: row.CONTENT,
      completed: row.COMPLETED === 1,
      createdAt: row.CREATED_AT,
      updatedAt: row.UPDATED_AT
    }));

    res.json(notes);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ error: 'Failed to fetch notes from database' });
  }
});

app.post('/api/notes', async (req, res) => {
  const { title, content } = req.body || {};
  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' });
  }

  try {
    if (isMemoryMode()) {
      const newNote = { id: nextId++, title, content, completed: 0 };
      memoryNotes.push(newNote);
      return res.status(201).json(newNote);
    }

    const { executeQuery, oracledb } = await import('./db.js');
    const result = await executeQuery(
      `INSERT INTO notes (user_id, title, content, completed) 
       VALUES (:user_id, :title, :content, 0) 
       RETURNING id, title, content, completed, created_at, updated_at 
       INTO :id, :ret_title, :ret_content, :ret_completed, :created_at, :updated_at`,
      {
        user_id: DEFAULT_USER_ID,
        title,
        content,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        ret_title: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        ret_content: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        ret_completed: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        created_at: { dir: oracledb.BIND_OUT, type: oracledb.DATE },
        updated_at: { dir: oracledb.BIND_OUT, type: oracledb.DATE }
      },
      { autoCommit: true }
    );

    const newNote = {
      id: result.outBinds.id[0],
      userId: DEFAULT_USER_ID,
      title: result.outBinds.ret_title[0],
      content: result.outBinds.ret_content[0],
      completed: result.outBinds.ret_completed[0] === 1,
      createdAt: result.outBinds.created_at[0],
      updatedAt: result.outBinds.updated_at[0]
    };

    res.status(201).json(newNote);
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).json({ error: 'Failed to create note in database' });
  }
});

app.put('/api/notes/:id/complete', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    if (isMemoryMode()) {
      const note = memoryNotes.find(n => n.id === id);
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      note.completed = 1;
      return res.json(note);
    }

    const { executeQuery, oracledb } = await import('./db.js');
    const result = await executeQuery(
      `UPDATE notes 
       SET completed = 1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = :id AND user_id = :user_id 
       RETURNING id, title, content, completed, created_at, updated_at 
       INTO :ret_id, :ret_title, :ret_content, :ret_completed, :ret_created_at, :ret_updated_at`,
      {
        id,
        user_id: DEFAULT_USER_ID,
        ret_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        ret_title: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        ret_content: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        ret_completed: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        ret_created_at: { dir: oracledb.BIND_OUT, type: oracledb.DATE },
        ret_updated_at: { dir: oracledb.BIND_OUT, type: oracledb.DATE }
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const updatedNote = {
      id: result.outBinds.ret_id[0],
      userId: DEFAULT_USER_ID,
      title: result.outBinds.ret_title[0],
      content: result.outBinds.ret_content[0],
      completed: result.outBinds.ret_completed[0] === 1,
      createdAt: result.outBinds.ret_created_at[0],
      updatedAt: result.outBinds.ret_updated_at[0]
    };

    res.json(updatedNote);
  } catch (err) {
    console.error('Error completing note:', err);
    res.status(500).json({ error: 'Failed to update note in database' });
  }
});

export default app;
