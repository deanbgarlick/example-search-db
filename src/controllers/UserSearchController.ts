import { Request, Response } from 'express'
import { UserSearchService } from '../services/UserSearchService'

export class UserSearchController {
  private userSearchService: UserSearchService

  constructor(userSearchService: UserSearchService) {
    this.userSearchService = userSearchService
  }

  searchUsers = async (req: Request, res: Response) => {
    try {
      const searchQuery = req.query.query as string
      const country = req.query.country as string

      const results = await this.userSearchService.searchUsers(searchQuery, country)
      res.json(results)
    } catch (error) {
      console.error('Search error:', error)
      res.status(500).json({ error: 'Failed to search users' })
    }
  }

  autocompleteUsers = async (req: Request, res: Response) => {
    try {
      const searchQuery = req.query.query as string
      const country = req.query.country as string

      const results = await this.userSearchService.autocompleteUsers(searchQuery, country)
      res.json(results)
    } catch (error) {
      console.error('Autocomplete error:', error)
      res.status(500).json({ error: 'Failed to autocomplete users' })
    }
  }
} 