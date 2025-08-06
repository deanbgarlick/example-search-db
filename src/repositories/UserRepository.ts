import { Collection } from 'mongodb'
import { User } from '../models/User'

export interface UserRepository {
  create(user: User): Promise<User>
  findById(userId: string): Promise<User | null>
  findAll(skip: number, limit: number): Promise<[User[], number]>
  update(userId: string, updates: Partial<User>): Promise<User | null>
  delete(userId: string): Promise<boolean>
}

export class MongoUserRepository implements UserRepository {
  private collection: Collection<User>

  constructor(collection: Collection<User>) {
    this.collection = collection
  }

  async create(user: User): Promise<User> {
    const result = await this.collection.insertOne(user)
    return { ...user, _id: result.insertedId }
  }

  async findById(userId: string): Promise<User | null> {
    return this.collection.findOne({ userId })
  }

  async findAll(skip: number, limit: number): Promise<[User[], number]> {
    const [users, total] = await Promise.all([
      this.collection.find().skip(skip).limit(limit).toArray(),
      this.collection.countDocuments()
    ])
    return [users, total]
  }

  async update(userId: string, updates: Partial<User>): Promise<User | null> {
    const result = await this.collection.findOneAndUpdate(
      { userId },
      { $set: updates },
      { returnDocument: 'after' }
    )
    return result.value
  }

  async delete(userId: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ userId })
    return result.deletedCount > 0
  }
} 