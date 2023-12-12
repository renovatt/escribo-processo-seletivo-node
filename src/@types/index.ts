type Cellphone = {
  ddd: string
  number: string
}

export interface UserProps {
  id: string
  name: string
  email: string
  password: string
  cellphones: Cellphone[]
  created_at: Date
  updated_at: Date
  last_login: Date
}
