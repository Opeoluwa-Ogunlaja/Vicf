import { Server } from "socket.io"

export const sendEventToRoom = (roomId: string, event: string, data: any, cb?: () => void) => {
    (global as any).io?.to(roomId).emit(event, data, cb)
}