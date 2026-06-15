import express from 'express'

const app = express()
const port = process.env.PORT ? Number(process.env.PORT) : 4000

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from ss-fassion backend!' })
})

app.get('/', (_req, res) => {
  res.send('ss-fassion backend is running')
})

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`)
})
