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
});
