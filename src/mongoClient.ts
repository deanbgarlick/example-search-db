import * as mongodb from 'mongodb'
import { dbConfig } from './config/mongodb'

export const mongoClient = new mongodb.MongoClient(dbConfig.MONGODB_HOST, {
  auth: {
    username: dbConfig.MONGODB_USERNAME,
    password: dbConfig.MONGODB_PASSWORD
  }
})
