import { useEffect, useRef, useState } from 'react'

const IndexedDBProvider = ({ dbName }: { dbName: string }) => {
  const dbRef = useRef<IDBDatabase>()
  const [error, setErrors] = useState<string | null>(null)

  useEffect(() => {
    const request = indexedDB.open('MyTestDatabase')
    request.onerror = () => {
      setErrors('Could not connect to IndexedDB')
    }
    request.onsuccess = event => {
      dbRef.current = (event?.target as EventTarget & { result: IDBDatabase })!.result
    }

    return () => {}
  }, [dbName])
  return { error, db: dbRef.current }
}

export default IndexedDBProvider
