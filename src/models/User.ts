import { ObjectId } from 'mongodb'

export interface User {
  _id?: ObjectId
  userId: string
  fullName: string
  email: string
  avatar: string
  registeredAt: Date
  country: string
}

export const USER_SEARCH_INDEX_NAME = 'user_search'
export const USER_AUTOCOMPLETE_INDEX_NAME = 'user_autocomplete' 