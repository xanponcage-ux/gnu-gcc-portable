export type User = {
  id?: number
  name?: string
  email: string
  passwordHash: string
  abilitys?: string | null
  photo?: string | null
  emailVerify?: number
}

export type Post = {
  id?: number,
  message?: string,
  imagePost?: string,
  author: string,
  authorId: number,
  createAt?: string
}
