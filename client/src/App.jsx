import React, { useEffect, useState } from 'react'

export default function App() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadNotes() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/notes')
      const data = await res.json()
      setNotes(data)
    } catch (e) {
      setError('Failed to fetch notes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotes()
  }, [])

  async function addNote(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to add note')
      }
      setTitle('')
      setContent('')
      await loadNotes()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto', fontFamily: 'Inter, system-ui, Arial' }}>
      <h1>AI Fullstack Notes</h1>

      <form onSubmit={addNote} style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Add Note</button>
      </form>

      {error && <div style={{ color: 'crimson', marginBottom: '1rem' }}>{error}</div>}

      <button onClick={loadNotes} disabled={loading}>
        {loading ? 'Loading…' : 'Refresh'}
      </button>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notes.map(n => (
          <li key={n.id} style={{ border: '1px solid #ddd', padding: '0.75rem', marginTop: '0.75rem', borderRadius: 8 }}>
            <strong>{n.title}</strong>
            <div>{n.content}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
