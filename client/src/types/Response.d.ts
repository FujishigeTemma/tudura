export interface ErrorResponse {
  status: number
}

export interface GetBoxesResponse {
  id: string
  name: string
  passwordRequired: boolean
  items: Item[]
  updatedAt: Date
}

export interface ItemResponse {
  id: string
  name: string
}

export interface PostBoxesAuthResponse {
  result: string
}