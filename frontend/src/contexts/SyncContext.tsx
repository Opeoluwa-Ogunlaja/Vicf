import { QueuedTask } from "@/stores/dexie/db";
import { createContext } from "react";

export const SyncContext = createContext<{
    tasks: QueuedTask[]
}>({
    tasks: []
})