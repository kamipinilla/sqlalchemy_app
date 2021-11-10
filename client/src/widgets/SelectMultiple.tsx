import { useCallback, useEffect, useState } from 'react'
import ReactSelect from 'react-select'

interface TagItemI<IdType> {
  value: IdType
  label: string
}

interface Props<ItemType, IdType> {
  onSelectedItemsIdsChange: (items: IdType[]) => void

  getItems: () => Promise<ItemType[]>
  getItemId: (item: ItemType) => IdType
  getItemDisplayName: (item: ItemType) => string

  initialItems?: ItemType[]
  placeholder?: string
  autofocus?: boolean
}

type ReactSelectItems = any

function SelectMultiple<ItemType, IdType extends string | number>(props: Props<ItemType, IdType>) {
  const {
    onSelectedItemsIdsChange,

    getItems,
    getItemId,
    getItemDisplayName,

    initialItems,
    placeholder,
    autofocus,
  } = props

  const itemToTagItem = useCallback((item: ItemType): TagItemI<IdType> => ({
    value: getItemId(item),
    label: getItemDisplayName(item),
  }), [getItemId, getItemDisplayName])

  const [allItems, setAllItems] = useState<ItemType[] | null>(null)
  useEffect(function updateAllItems() {
    getItems().then(setAllItems)
  }, [getItems])

  const [selectedTagItems, setSelectedTagItems] = useState<TagItemI<IdType>[]>([])

  useEffect(function setInitialItems() {
    if (initialItems) {
      const initialTagItems = initialItems.map(itemToTagItem)
      setSelectedTagItems(initialTagItems)
    }
  }, [initialItems, getItemId, getItemDisplayName, itemToTagItem])

  useEffect(function sendSelectedItemsUpdate() {
    const selectedItemsIds = selectedTagItems.map(selectedTagItem => selectedTagItem.value)
    onSelectedItemsIdsChange(selectedItemsIds)
  }, [selectedTagItems, onSelectedItemsIdsChange])

  const handleTagItemsChange = useCallback((selectItems: ReactSelectItems) => {
    setSelectedTagItems(selectItems)
  }, [])

  let allDisplayItems = allItems ? allItems.map(itemToTagItem) : []
  return (
    <div>
      <ReactSelect
        isMulti
        value={selectedTagItems}
        onChange={handleTagItemsChange}
        options={allDisplayItems}

        placeholder={placeholder}
        autoFocus={autofocus} />
    </div>
  )
}

export default SelectMultiple