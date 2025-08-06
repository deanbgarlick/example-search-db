import { Request, Response } from 'express'
import { mongoClient } from '../mongoClient'
import { User } from '../models/User'
import { buildSearchPipeline, buildAutocompletePipeline } from '../utils/searchPipeline'
import { dbConfig } from '../config/mongodb'

export async function searchUsers(req: Request, res: Response) {
  const searchQuery = req.query.query as string
  const country = req.query.country as string

  if (!searchQuery || searchQuery.length < 2) {
    res.json([])
    return
  }

  const db = mongoClient.db(dbConfig.MONGODB_DATABASE)
  const collection = db.collection<User>(dbConfig.MONGODB_COLLECTION)

  const pipeline = buildSearchPipeline(searchQuery, country)
  const result = await collection.aggregate(pipeline).sort({ score: -1 }).limit(10)
  const array = await result.toArray()
  res.json(array)
}

export async function autocompleteUsers(req: Request, res: Response) {
  const searchQuery = req.query.query as string
  const country = req.query.country as string

  const db = mongoClient.db(dbConfig.MONGODB_DATABASE)
  const collection = db.collection<User>(dbConfig.MONGODB_COLLECTION)

  const pipeline = buildAutocompletePipeline(searchQuery, country)
  const result = await collection.aggregate(pipeline).sort({ score: -1 }).limit(10)
  const array = await result.toArray()
  res.json(array)
} 