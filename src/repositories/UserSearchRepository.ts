import { Collection } from 'mongodb'
import { User } from '../models/User'
import { buildSearchPipeline, buildAutocompletePipeline } from '../utils/searchPipeline'

export interface SearchResult {
  users: User[]
  score: number
}

export interface UserSearchRepository {
  search(query: string, country?: string): Promise<SearchResult[]>
  autocomplete(query: string, country?: string): Promise<SearchResult[]>
}

export class MongoUserSearchRepository implements UserSearchRepository {
  private collection: Collection<User>
  private readonly DEFAULT_LIMIT = 10

  constructor(collection: Collection<User>) {
    this.collection = collection
  }

  async search(query: string, country?: string): Promise<SearchResult[]> {
    const pipeline = buildSearchPipeline(query, country)
    const result = await this.collection
      .aggregate(pipeline)
      .sort({ score: -1 })
      .limit(this.DEFAULT_LIMIT)
      .toArray()
    
    return result as SearchResult[]
  }

  async autocomplete(query: string, country?: string): Promise<SearchResult[]> {
    const pipeline = buildAutocompletePipeline(query, country)
    const result = await this.collection
      .aggregate(pipeline)
      .sort({ score: -1 })
      .limit(this.DEFAULT_LIMIT)
      .toArray()
    
    return result as SearchResult[]
  }
} 