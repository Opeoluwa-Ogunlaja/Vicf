import { SyncContext } from "@/contexts/SyncContext"
import { useContext } from "react"


export const useSyncData = () => {
    const data = useContext(SyncContext)

    if(!data) throw new Error("Sync Data can only be used in a Sync Provider")

    return data
}