import { SkillI, SkillId } from '../types'
import { host } from './config'
import { get, post, del } from './rest'

const entryName = 'skills'

export async function createSkill(skill: Partial<SkillI>) {
  await post(`${host}/${entryName}`, skill)
}

export async function getSkills(): Promise<SkillI[]> {
  const response = await get(`${host}/${entryName}`)
  const json = await response.json()
  return json.items as SkillI[]
}

export async function deleteSkill(skillId: SkillId) {
  await del(`${host}/${entryName}/${skillId}`)
}