export const emptyBaseContact = {
  email: '',
  number: '',
  additional_information: {},
  overwrite: false,
  overwrite_name: ''
}

export const emptyBaseContactManager = {
  backed_up: false,
  contacts_count: 0,
  input_backup: JSON.stringify(emptyBaseContact)
}
