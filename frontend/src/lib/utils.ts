import { IContact } from '@/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const pipe =
  (...fns: ((...args: unknown[]) => unknown)[]) =>
  (x: unknown) =>
    fns.reduce((v, f) => f(v), x)

export const abbreviateName = (name: string) => name.split(" ").map((word) => word[0].toUpperCase()).join('')

export const filteredContacts = (contacts: Partial<IContact>[]): Pick<IContact, '_id' | 'additional_information' | 'email' | 'name' | 'time_added' | 'time_updated'>[] => {
  return contacts.map(contact => {
    return {
      _id: contact._id!,
      additional_information: contact.additional_information!,
      name: contact.overwrite_name ?? contact.name!,
      time_added: contact.time_added!,
      email: contact.email!,
      time_updated: contact.time_updated!
    }
  })
}