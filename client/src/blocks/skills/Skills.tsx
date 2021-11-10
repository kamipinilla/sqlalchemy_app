import { useCallback, useEffect, useState } from 'react'
import { createSkill, getSkills, deleteSkill } from '../../api/skills'
import { SkillI, SkillId } from '../../types'
import Button from '../../widgets/Button'
import H from '../../widgets/H'
import Header from '../../widgets/Header'
import List from '../../widgets/List'
import ListItem from '../../widgets/ListItem'
import SubmitInput from '../../widgets/SubmitInput'

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<SkillI[] | null>(null)
  
  const updateSkills = useCallback(() => {
    getSkills().then(setSkills)
  }, [])
  useEffect(updateSkills, [updateSkills])

  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [hasDeleted, setHasDeleted] = useState<boolean>(false)

  const [isAdding, setIsAdding] = useState<boolean>(false)

  const [addSkillError, setAddSkillError] = useState<string | null>(null)

  const addSkill = useCallback((name: string) => {
    if (skills!.some(skill => skill.name === name)) {
      setAddSkillError(`Skill "${name}" already exists`)
      return
    }

    const newSkill: Partial<SkillI> = {
      name
    }

    createSkill(newSkill).then(updateSkills)
  }, [skills, updateSkills])

  const exitDeletion = useCallback(() => {
    setIsDeleting(false)
    setHasDeleted(false)
  }, [])

  const removeSkill = useCallback((skillId: SkillId) => {
    deleteSkill(skillId).then(updateSkills)
    setHasDeleted(true)
    
  }, [updateSkills])

  useEffect(function exitDeletionIfNoMoreSkills() {
    if (isDeleting && skills && skills.length === 0) {
      exitDeletion()
    }
  }, [isDeleting, skills, exitDeletion])

  if (!skills) return null

  const skillListItems = skills.map(skill => (
    <ListItem key={skill.id} onClick={isDeleting ? () => removeSkill(skill.id) : undefined}>{skill.name}</ListItem>
  ))

  let bottomDisplay
  if (isAdding) {
    bottomDisplay = (
      <SubmitInput
        onSubmit={addSkill}
        onCancel={() => { setIsAdding(false); setAddSkillError(null)} }
        onTypingResumed={() => setAddSkillError(null)}
        errorMessage={addSkillError ?? undefined}
        autofocus
        showHowTo />
    )
  } else if (isDeleting) {
    bottomDisplay = (
      <div className="flex flex-col space-y-2">
        <div>Click skills to delete</div>
        <Button onClick={exitDeletion}>{hasDeleted ? 'Done' : 'Cancel'}</Button>
      </div> 
    )
  } else {
    bottomDisplay = (
      <div className="flex space-x-2">
        <Button onClick={() => setIsAdding(true)}>Add Skill</Button>
        {!!skills.length && <Button onClick={() => setIsDeleting(true)}>Delete Skills...</Button>}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Header>
        <H>Skills</H>
      </Header>
      {!!skills.length &&
        <div className="border-2 border-gray-200 rounded-md">
          <List>
            {skillListItems}
          </List>
        </div>
      }
      {bottomDisplay}
    </div>
  )
}

export default Skills