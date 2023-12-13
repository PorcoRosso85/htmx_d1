// for join table
export type UserBasic = {
  id: string
  username: string
  birthdate: Date
}

export type UserContact = {
  id: string
  email: string
  phone: string
}

export type User = UserBasic & UserContact
