import { UserSearchRepository, SearchResult } from '../repositories/UserSearchRepository'

export class UserSearchService {
  private searchRepository: UserSearchRepository
  private readonly MIN_QUERY_LENGTH = 2

  constructor(searchRepository: UserSearchRepository) {
    this.searchRepository = searchRepository
  }

  async searchUsers(query: string, country?: string): Promise<SearchResult[]> {
    if (!this.isValidQuery(query)) {
      return []
    }

    try {
      return await this.searchRepository.search(query, country)
    } catch (error) {
      console.error('Error searching users:', error)
      throw new Error('Failed to search users')
    }
  }

  async autocompleteUsers(query: string, country?: string): Promise<SearchResult[]> {
    if (!this.isValidQuery(query)) {
      return []
    }

    try {
      return await this.searchRepository.autocomplete(query, country)
    } catch (error) {
      console.error('Error autocompleting users:', error)
      throw new Error('Failed to autocomplete users')
    }
  }

  private isValidQuery(query: string | undefined): boolean {
    return Boolean(query && query.length >= this.MIN_QUERY_LENGTH)
  }
} 