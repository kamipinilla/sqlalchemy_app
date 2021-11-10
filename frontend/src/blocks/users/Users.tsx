import { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { SkillI, SkillId, UserI, UserId } from '../../types'
import { createUsersBatch, deleteAllUsers, getUsers, getUsersWithAllSkills, getUsersWithAnyOfSkills } from '../../api/users'
import SelectMultiple from '../../widgets/SelectMultiple'
import { getSkills } from '../../api/skills'
import Button from '../../widgets/Button'
import H from '../../widgets/H'
import UsersTable from './UsersTable'
import CheckboxSwitch from '../../widgets/CheckboxSwitch'
import Header from '../../widgets/Header'

const Users: React.FC = () => {
  const history = useHistory()

  const [isRequireAll, setIsRequireAll] = useState<boolean>(true)

  const [users, setUsers] = useState<UserI[] | null>(null)
  const loadUsers = useCallback(() => {
    getUsers().then(setUsers)
  }, [])
  useEffect(loadUsers, [loadUsers])

  const [selectedSkillsIds, setSelectedSkillsIds] = useState<SkillId[]>([])
  const handleSelectedSkillsIdsChange = useCallback((selectedSkillsIds: SkillId[]) => {
    setSelectedSkillsIds(selectedSkillsIds)
  }, [])

  const [usersWithSkills, setUsersWithSkills] = useState<UserI[]>([])

  useEffect(() => {
    if (selectedSkillsIds.length) {
      const getUsersWithSkills = isRequireAll ? getUsersWithAllSkills : getUsersWithAnyOfSkills
      getUsersWithSkills(selectedSkillsIds).then(setUsersWithSkills)
    }
  }, [selectedSkillsIds, isRequireAll])

  const [allSkillsCount, setAllSkillsCount] = useState<number | null>(null)
  useEffect(function updateAllSkillsCount() {
    getSkills().then(skills => setAllSkillsCount(skills.length))
  }, [])

  const getSkillId = useCallback((skill: SkillI) => skill.id, [])
  const getSkillName = useCallback((skill: SkillI) => skill.name, [])

  const addUsers = useCallback(() => {
    createUsersBatch().then(loadUsers)
  }, [loadUsers])

  const removeUsers = useCallback(() => {
    deleteAllUsers().then(loadUsers)
  }, [loadUsers])

  const goToSkills = useCallback(() => {
    history.push('/skills')
  }, [history])

  const goToUser = useCallback((userId: UserId) => {
    history.push(`/users/${userId}`)
  }, [history])

  if (!users) return null

  const usersList = selectedSkillsIds.length ? usersWithSkills : users

  return (
    <div className="space-y-7">
      <Header>
        <div className="flex justify-between items-center">
          <H>Users</H>
          <Button onClick={goToSkills} type='dark'>Manage Skills</Button>
        </div>
      </Header>
      {!!users.length &&
        <div className="space-y-8">
          {allSkillsCount !== null && allSkillsCount !== 0 &&
            <div className="space-y-2">
              <SelectMultiple
                onSelectedItemsIdsChange={handleSelectedSkillsIdsChange}

                getItems={getSkills}
                getItemId={getSkillId}
                getItemDisplayName={getSkillName}

                autofocus
                placeholder="Filter by skills..." />
              {selectedSkillsIds.length >= 2 &&
                <CheckboxSwitch
                  checked={isRequireAll}
                  onChange={setIsRequireAll}
                  onLabel={<div>Require <b>all</b></div>}
                  offLabel={<div>Require <b>any</b></div>} />
              }
            </div>
          }
          <UsersTable
            users={usersList}
            onUserClick={(allSkillsCount !== null && allSkillsCount !== 0) ? goToUser : undefined} />
        </div>
      }
      <div className="flex space-x-2">
        <Button onClick={addUsers}>Add Users</Button>
        {!!users.length &&
          <Button onClick={removeUsers}>Delete All Users</Button>
        }
      </div>
    </div>
  )
}

export default Users