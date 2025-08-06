import { Request, Response } from 'express'
import { UserService } from '../services/UserService'

export class UserCrudController {
  private userService: UserService

  constructor(userService: UserService) {
    this.userService = userService
  }

  createUser = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.createUser(req.body)
      res.status(201).json(user)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Failed to create user' })
      }
    }
  }

  getUser = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.getUser(req.params.userId)
      res.json(user)
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({ error: 'User not found' })
      } else {
        res.status(500).json({ error: 'Failed to retrieve user' })
      }
    }
  }

  getAllUsers = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const result = await this.userService.getUsers(page, limit)
      res.json(result)
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve users' })
    }
  }

  updateUser = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.updateUser(req.params.userId, req.body)
      res.json(user)
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({ error: 'User not found' })
      } else {
        res.status(500).json({ error: 'Failed to update user' })
      }
    }
  }

  deleteUser = async (req: Request, res: Response) => {
    try {
      await this.userService.deleteUser(req.params.userId)
      res.status(204).send()
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({ error: 'User not found' })
      } else {
        res.status(500).json({ error: 'Failed to delete user' })
      }
    }
  }
} 