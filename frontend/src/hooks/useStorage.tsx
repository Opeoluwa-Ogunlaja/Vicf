import { useCallback, useState } from 'react'

function useStorage<T>(storage: Storage, key: string, initialValue: T) {
  const [value, setValue] = useState(() => {
    if (storage.getItem(key) == null) {
      if (typeof initialValue == 'function') {
        storage.setItem(key, JSON.stringify(initialValue()))
        return initialValue()
      } else {
        storage.setItem(key, JSON.stringify(initialValue))
        return initialValue
      }
    } else {
      return JSON.parse(storage.getItem(key) as string)
    }
  })

  const set = useCallback(
    (newValue: T) => {
      const jsonValue = JSON.stringify(newValue)
      storage.setItem(key, jsonValue)
      setValue(newValue)
    },
    [storage, key]
  )

  const remove = useCallback(() => {
    storage.removeItem(key)
    setValue(null)
  }, [storage, key])

  return [value, set, remove]
}

export const useLocalStorage = (key: string, value = '') => {
  return useStorage<string>(localStorage, key, value)
}

export const useSessionStorage = (key: string, value = '') => {
  return useStorage<string>(sessionStorage, key, value)
}
