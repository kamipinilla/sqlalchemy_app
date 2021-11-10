type UserId = number
export interface UserI {
  id: UserId
  name: string
}

type SkillId = number
export interface SkillI {
  id: SkillId
  name: string
}

export interface Object {
  [key: string]: unknown
}

export type twString = string