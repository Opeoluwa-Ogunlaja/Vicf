import { AxiosError } from 'axios'
import { axiosInstance } from './axiosInstance'
import CustomAppError from './customAppError'
import { LoginFormType, SignupFormType } from '@/lib/utils/form-schemas'
import { IUser } from '@/types/user'
import { ContactManagerEntry } from '@/types/contacts_manager'
import { IContact } from '@/types'
import { wait } from './promiseUtils'
import { TokenRequestManager } from '../TokenRequestManager'

const throwError = (error: AxiosError) => {
  throw new CustomAppError(error)
}

const checkError = (err: AxiosError) => {
  if (err.code !== 'ERR_NETWORK') {
    throwError(err)
  } else {
    throw err
  }
}

const fetchAccessToken = async (): Promise<{ token: string }> => {
  const response = await axiosInstance.get('/api/users/token')
  return response.data.data
}

const tokenManager = new TokenRequestManager(fetchAccessToken)

export const getAccessToken = async () => {
  try {
    return await tokenManager.getToken()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

// export const getAccessToken = async () => {
//   try {
//     const newUser = await axiosInstance.get('/users/token')

//     return newUser.data.data
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     checkError(error)
//   }
// }

export const signup_user = async ({
  email,
  name,
  password
}: SignupFormType): Promise<IUser | undefined> => {
  try {
    const newUser = await axiosInstance.post('/api/users/register', {
      email,
      name,
      password
    })

    return newUser.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const login_user = async ({
  email,
  password
}: LoginFormType): Promise<IUser | undefined> => {
  try {
    const newUser = await axiosInstance.post('/api/users/login', {
      email,
      password
    })

    
    return newUser.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const google_login = async ({
  code
}: {
  code: string
}): Promise<(IUser & { token: string }) | undefined> => {
  try {
    const newUser = await axiosInstance.post('/api/users/google-login', {
      code
    })

    return newUser.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const get_profile = async (): Promise<IUser | undefined> => {
  try {
    const newUser = await axiosInstance.get('/api/users/profile')

    return newUser.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const get_contacts_manager = async (
  authToken?: string
): Promise<ContactManagerEntry[] | undefined> => {
  try {
    const newUser = await axiosInstance.get(
      '/api/contacts/manager',
      authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : undefined
    )

    return newUser.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const create_contact_listing = async ({
  _id,
  url_id,
  name,
  input_backup
}: {
  _id: string,
  url_id: string
  name?: string
  input_backup?: string
}) => {
  try {
    const newListing = await axiosInstance.post('/api/contacts/create', {
      _id,
      url_id,
      name,
      input_backup
    })

    return newListing.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const add_contact_listing = async (listingId: string, data: any) => {
  try {
    const newListing = await axiosInstance.post(`/api/contacts/${listingId}/add-contact`, data)

    return newListing.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const update_contact_input_backup = async (id: string, backup: Partial<IContact>) => {
  try {
    const newListing = await axiosInstance.patch(`/api/contacts/backup-input/${id}`, backup)

    return newListing.data.data.input_backup
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const update_contact_name_backup = async (id: string, newName: string) => {
  try {
    const newListing = await axiosInstance.patch(`/api/contacts/${id}/name`, { name: newName })

    return newListing.data.data.name
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const update_manager_slug = async (id: string, slug_type: string) => {
  try {
    const newListing = await axiosInstance.patch(`/api/contacts/${id}/slug-type`, {
      slug_type: slug_type
    })

    return newListing.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const update_contact = async (id: string, data: Partial<IContact>) => {
  try {
    const newListing = await axiosInstance.patch(`/api/contacts/contact/${id}/`, data)

    return newListing.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const get_contact_listing = async (
  listing_id: string
): Promise<ContactManagerEntry[] | undefined> => {
  try {
    const newUser = await axiosInstance.get(`/api/contacts/${listing_id}/`)

    return newUser.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const get_contacts = async (listing_id: string): Promise<IContact[] | undefined> => {
  try {
    const newUser = await axiosInstance.get(`/api/contacts/${listing_id}/contacts`)

    return newUser.data.data || []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const delete_contact = async (
  listing_id: string,
  contact_id: string
): Promise<IContact[] | undefined> => {
  try {
    const newUser = await axiosInstance.delete(`/api/contacts/${listing_id}/${contact_id}`)

    return (
      newUser.data.data.flatMap((contact: { contacts: IContact }) => {
        return contact.contacts
      }) || []
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const delete_contact_listing = async (
  listing_id: string,
): Promise<ContactManagerEntry | undefined> => {
  try {
    const deletedListing = await axiosInstance.delete(`/api/contacts/${listing_id}`) as ContactManagerEntry

    return deletedListing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const testPromise = async () => {
  await wait(Math.random() * 15000)
  if (Math.random() < 0.7) {
    return true
  } else {
    return false
  }
}

export const createOrganisation = async (organisation_name: string) => {
  try {
    const newUser = await axiosInstance.post('/api/organisations/create', {
      name: organisation_name
    })

    return newUser.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const get_organisations_for_me = async () => {
  try {
    const newUser = await axiosInstance.get(`/api/organisations/me`)

    return newUser.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const get_organisation = async (organisationId: string) => {
  try {
    const newUser = await axiosInstance.get(`/api/organisations/${organisationId}`)

    return newUser.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const get_organisation_from_invite = async (inviteCode: string) => {
  try {
    const newUser = await axiosInstance.get(`/api/organisations/inviteCode/${inviteCode}`)

    return newUser.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const join_organisation_from_invite = async (inviteCode: string) => {
  try {
    const newUser = await axiosInstance.put(`/api/organisations/inviteCode/${inviteCode}`)

    return newUser.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const get_organisation_members = async (organisationId: string) => {
  try {
    const newUser = await axiosInstance.get(`/api/organisations/${organisationId}/members`)

    return newUser.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export const move_listing_to_organisation = async (listingId: string, organisationId: string) => {
  try {
    const newUser = await axiosInstance.patch(`/api/contacts/${listingId}/move-to-org`, {
      organisationId
    })

    return newUser.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}

export async function downloadVcf(listingId: string, onProgress: (percentage: number) => void) {
  const response = await axiosInstance.get(`/api/contacts/${listingId}/download-vcf`, {
    responseType: 'blob',
    onDownloadProgress: (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = (event.loaded / event.total!) * 100;
        onProgress(percent);
      }
    }
  });

  const blob = new Blob([response.data], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'contacts.vcf';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function downloadCsv(listingId: string, onProgress: (percentage: number) => void) {
  const response = await axiosInstance.get(`/api/contacts/${listingId}/download-csv`, {
    responseType: 'blob',
    onDownloadProgress: (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = (event.loaded / event.total!) * 100;
        onProgress(percent);
      }
    }
  });

  const blob = new Blob([response.data], { type: 'text/csv; charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'contacts.csv';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function downloadXlsx(listingId: string, onProgress: (percentage: number) => void) {
  const response = await axiosInstance.get(`/api/contacts/${listingId}/download-xlsx`, {
    responseType: 'blob',
    onDownloadProgress: (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = (event.loaded / event.total!) * 100;
        onProgress(percent);
      }
    }
  });

  const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'contacts.xlsx';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function connectGoogle() {
  return new Promise((res, rej) => {
    window.open(
    "http://localhost:3002/users/permissions", // backend endpoint
    "googleLogin",
    "width=500,height=600"
  );

  // Listen for message from popup
  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin) rej(new Error("Forbidden"));

    if (event.data.success) {
     res(event.data.userId);
      // Update state or trigger refetch
    } else {
      res(event.data.error);
    }
  });
  })
}

export const initiate_drive_for_user = async () => {
  try {
    return await connectGoogle()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    checkError(error)
  }
}