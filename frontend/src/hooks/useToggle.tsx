import { useState } from 'react'

export const useToggle = (
  initialValue: boolean
): [boolean, (val: boolean) => void, (val: boolean) => void] => {
  const [bool, setBool] = useState<boolean>(initialValue)

  const toggle = () => {
    setBool(bool => !bool)
  }

  const set = (val: boolean) => {
    setBool(val)
  }

  return [bool, toggle, set]
}
