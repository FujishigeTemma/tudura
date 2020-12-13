export interface ErrorResponse {
  status: number
  data: string
}

export interface GetBoxesResponse {
  id: string
  name: string
  passwordRequired: boolean
  items: Item[]
  updatedAt: Date
}

export interface PostItemResponse {
  id: string
  boxId: string
  name: string
  expiresAt: Date
}

export interface PostBoxesAuthResponse {
  result: string
}

export interface PostBoxesResponse {
  id: string
  name: string
  items: Item[]
  updatedAt: Date
}