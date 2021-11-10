import { UserId, SkillId, SkillI, UserI } from '../types'
import { host } from './config'
import { del, get, post } from './rest'

const entryName = 'users'

export async function createUsersBatch() {
  await post(`${host}/${entryName}`)
}

export async function deleteAllUsers() {
  await del(`${host}/${entryName}`)
}

export async function getUser(userId: UserId): Promise<UserI> {
  const response = await get(`${host}/${entryName}/${userId}`)
  const user = await response.json()
  return user as UserI
}

export async function getUsers(): Promise<UserI[]> {
  const response = await get(`${host}/${entryName}`)
  const json = await response.json()
  return json.items as UserI[]
}

export async function getUserSkills(userId: UserId): Promise<SkillI[]> {
  const response = await get(`${host}/${entryName}/${userId}/skills`)
  const json = await response.json()
  return json.items as SkillI[]
}

export async function setUserSkills(userId: UserId, skillsIds: SkillId[]) {
  await post(`${host}/${entryName}/${userId}/skills`, { skillsIds })
}

export async function getUsersWithAllSkills(skillsIds: SkillId[]): Promise<UserI[]> {
  const response = await post(`${host}/${entryName}/with_all_skills`, { skillsIds })
  const json = await response.json()
  return json.items as UserI[]
}

export async function getUsersWithAnyOfSkills(skillsIds: SkillId[]): Promise<UserI[]> {
  const response = await post(`${host}/${entryName}/with_any_of_skills`, { skillsIds })
  const json = await response.json()
  return json.items as UserI[]
}