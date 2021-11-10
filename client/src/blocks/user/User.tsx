import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getSkills } from '../../api/skills'
import { getUser, getUserSkills, setUserSkills } from '../../api/users'
import { SkillI, SkillId, UserI, UserId } from '../../types'
import H from '../../widgets/H'
import SelectMultiple from '../../widgets/SelectMultiple'
import Header from '../../widgets/Header'

interface MatchParams {
  userId: string
}

const User: React.FC = () => {
  const params = useParams<MatchParams>()
  const userId: UserId = parseInt(params.userId)

  const [user, setUser] = useState<UserI | null>(null)
  useEffect(function updateUser() {
    getUser(userId).then(setUser)
  }, [userId])

  const [initialSkills, setInitialSkills] = useState<SkillI[]>([])
  const fetchInitialSkills = useCallback(() => {
    getUserSkills(userId).then(setInitialSkills)
  }, [userId])
  useEffect(fetchInitialSkills, [fetchInitialSkills])

  const [selectedSkillsIds, setSelectedSkillsIds] = useState<SkillId[]>([])

  useEffect(() => {
    setUserSkills(userId, selectedSkillsIds)
  }, [selectedSkillsIds, userId])

  const handleSelectedSkillsIdsChange = useCallback((selectedSkillsIds: SkillId[]) => {
    setSelectedSkillsIds(selectedSkillsIds)
  }, [])

  const getSkillId = useCallback(skill => skill.id, [])
  const getSkillName = useCallback(skill => skill.name, [])

  if (!user) return null

  return (
    <div className="space-y-8">
      <Header>
        <H>{user.name}</H>
      </Header>
      <div className="space-y-4">
        <H size="md">Skills</H>
        <SelectMultiple
          initialItems={initialSkills}
          onSelectedItemsIdsChange={handleSelectedSkillsIdsChange}

          getItems={getSkills}
          getItemId={getSkillId}
          getItemDisplayName={getSkillName}

          autofocus
          placeholder="Select..." />
      </div>
    </div>
  )
}

export default User