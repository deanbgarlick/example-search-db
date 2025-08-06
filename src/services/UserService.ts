import { User } from '../models/User'
import { UserRepository } from '../repositories/UserRepository'

export class UserService {
  private userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async createUser(userData: Omit<User, '_id' | 'registeredAt'>): Promise<User> {
    const user: User = {
      ...userData,
      registeredAt: new Date()
    }

    // Validate user data
    this.validateUser(user)

    return this.userRepository.create(user)
  }

  async getUser(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }

  async getUsers(page: number, limit: number): Promise<{
    users: User[]
    page: number
    limit: number
    total: number
    totalPages: number
  }> {
    const skip = (page - 1) * limit
    const [users, total] = await this.userRepository.findAll(skip, limit)

    return {
      users,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    // Prevent updating critical fields
    delete updates.userId
    delete updates.registeredAt
    delete updates._id

    const updatedUser = await this.userRepository.update(userId, updates)
    if (!updatedUser) {
      throw new Error('User not found')
    }
    return updatedUser
  }

  async deleteUser(userId: string): Promise<void> {
    const deleted = await this.userRepository.delete(userId)
    if (!deleted) {
      throw new Error('User not found')
    }
  }

  private validateUser(user: User): void {
    if (!user.fullName || user.fullName.trim().length === 0) {
      throw new Error('Full name is required')
    }
    if (!user.email || !this.isValidEmail(user.email)) {
      throw new Error('Valid email is required')
    }
    if (!user.country || user.country.trim().length === 0) {
      throw new Error('Country is required')
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
} 