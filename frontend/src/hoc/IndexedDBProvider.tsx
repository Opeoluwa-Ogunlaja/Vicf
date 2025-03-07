import { useEffect, useRef, useState } from 'react'

const IndexedDBProvider = ({ dbName }: { dbName: string }) => {
  const dbRef = useRef<IDBDatabase>()
  const [error, setErrors] = useState<unknown>(null)

  useEffect(() => {
    const request = indexedDB.open('MyTestDatabase')
    const onError = (err: unknown) => {
      setErrors(err)
    }
    const onSuccess = (event: Event) => {
      dbRef.current = (event?.target as EventTarget & { result: IDBDatabase })!.result
    }
    request.onerror = onError
    request.onsuccess = onSuccess

    return () => {
      request.removeEventListener('error', onError)
      request.removeEventListener('success', onSuccess)
    }
  }, [dbName])
  return { error, db: dbRef.current }
}

export default IndexedDBProvider
