const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  res.removeHeader('X-Powered-By')
  next()
})

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const note = notes.find(n => n.id === id)
  if (note) {
    res.json(note)
  } else {
    res.statusMessage = "foo bar"
    res.status(404).end()
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id
  notes = notes.filter(note => note.id !== id)
  res.status(204).end()
})

const generateId = () => {
  return Math.max(...notes.map(note => Number(note.id)), 0) + 1
}

app.post('/api/notes', (req, res) => {
  const body = req.body
  if (!body.content) {
    return res.status(400).json({ error: 'note content is required' })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId()
  }

  notes = notes.concat(note)
  res.json(note)
})

app.put('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const body = req.body
  const note = notes.find(note => note.id === id)
  if (!note) {
    return res.status(404).end()
  }

  const updatedNote = {
    ...note,
    important: body.important
  }

  notes = notes.map(n => n.id === id ? updatedNote : n)

  res.json(updatedNote)
})

const notFound = (req, res) => {
  res.status(404).json({ error: 'not found' })
}

app.use(notFound)

const PORT = process.env.PORT || 3001

app.listen(PORT)
console.log(`listening on port ${PORT}`)