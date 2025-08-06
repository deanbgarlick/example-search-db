import express from 'express'
import cors from 'cors'
import { mongoClient } from './mongoClient'
import { searchUsers, autocompleteUsers } from './controllers/userSearch'
import { ensureSearchIndexes } from './services/searchIndex'

const app = express()

app.use(cors({ credentials: true, origin: 'http://localhost:4000' }))

app.get('/search', searchUsers)
app.get('/autocomplete', autocompleteUsers)

async function main() {
  try {
    await mongoClient.connect()
    await ensureSearchIndexes()

    app.listen(3001, () => console.log('http://localhost:3001/search?query=gilbert'))
  } catch (err) {
    console.log(err)
  }

  process.on('SIGTERM', async () => {
    await mongoClient.close()
    process.exit(0)
  })
}

main() 