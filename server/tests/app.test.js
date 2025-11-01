// Force in-memory mode for tests BEFORE importing app
process.env.USE_MEMORY_MODE = 'true';

import request from 'supertest';
import app from '../src/app.js';

describe('Notes API', () => {
  test('GET /api/notes returns initial notes', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0]).toHaveProperty('title');
  });

  test('POST /api/notes creates a new note', async () => {
    const newNote = { title: 'Test', content: 'Created via test' };
    const res = await request(app)
      .post('/api/notes')
      .send(newNote)
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(newNote);

    const list = await request(app).get('/api/notes');
    expect(list.body.find(n => n.title === 'Test')).toBeTruthy();
  });

  test('POST /api/notes validates input', async () => {
    const res = await request(app).post('/api/notes').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title and content/i);
  });

  test('PUT /api/notes/:id/complete marks note as completed', async () => {
    // First create a note
    const newNote = { title: 'Task', content: 'To be completed' };
    const createRes = await request(app)
      .post('/api/notes')
      .send(newNote);
    const noteId = createRes.body.id;

    // Mark it as completed
    const res = await request(app).put(`/api/notes/${noteId}/complete`);
    expect(res.status).toBe(200);
    expect(res.body.completed).toBeTruthy();
    expect(res.body.id).toBe(noteId);
  });

  test('PUT /api/notes/:id/complete returns 404 for non-existent note', async () => {
    const res = await request(app).put('/api/notes/99999/complete');
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});
