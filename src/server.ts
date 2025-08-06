import express from 'express'
import cors from 'cors'
import { mongoClient } from './mongoClient'
import { UserSearchController } from './controllers/UserSearchController'
import { UserCrudController } from './controllers/UserCrudController'
import { MongoUserCrudRepository } from './repositories/UserCrudRepository'
import { MongoUserSearchRepository } from './repositories/UserSearchRepository'
import { UserCrudService } from './services/UserCrudService'
import { UserSearchService } from './services/UserSearchService'
import { ensureSearchIndexes } from './services/searchIndex'
import { dbConfig } from './config/mongodb'
import { User } from './models/User'

const app = express()

app.use(cors({ credentials: true, origin: 'http://localhost:4000' }))
app.use(express.json())

// Initialize dependencies
const db = mongoClient.db(dbConfig.MONGODB_DATABASE)
const userCollection = db.collection<User>(dbConfig.MONGODB_COLLECTION)

// CRUD dependencies
const userCrudRepository = new MongoUserCrudRepository(userCollection)
const userCrudService = new UserCrudService(userCrudRepository)
const userCrudController = new UserCrudController(userCrudService)

// Search dependencies
const userSearchRepository = new MongoUserSearchRepository(userCollection)
const userSearchService = new UserSearchService(userSearchRepository)
const userSearchController = new UserSearchController(userSearchService)

// Search endpoints
app.get('/search', userSearchController.searchUsers)
app.get('/autocomplete', userSearchController.autocompleteUsers)

// CRUD endpoints
app.post('/users', userCrudController.createUser)
app.get('/users', userCrudController.getAllUsers)
app.get('/users/:userId', userCrudController.getUser)
app.put('/users/:userId', userCrudController.updateUser)
app.delete('/users/:userId', userCrudController.deleteUser)

async function main() {
  try {
    await mongoClient.connect()
    await ensureSearchIndexes()

    app.listen(3001, () => {
      console.log('Server running at http://localhost:3001')
      console.log('Available endpoints:')
      console.log('- GET    /search?query=<text>')
      console.log('- GET    /autocomplete?query=<text>')
      console.log('- POST   /users')
      console.log('- GET    /users')
      console.log('- GET    /users/:userId')
      console.log('- PUT    /users/:userId')
      console.log('- DELETE /users/:userId')
    })
  } catch (err) {
    console.log(err)
  }

  process.on('SIGTERM', async () => {
    await mongoClient.close()
    process.exit(0)
  })
}

main() 