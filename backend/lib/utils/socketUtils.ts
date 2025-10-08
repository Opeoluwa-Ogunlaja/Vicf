import { getSocketHandler } from "../.."


export const sendEventToRoom = (roomId: string, event: string, data: any, cb?: () => void) => {
    getSocketHandler()!.io?.to(roomId).emit(event, data, cb)
}

export const sendEventToUser = (userId: string, event: string, data: any, cb?: () => void) => {
    const socketHandler = getSocketHandler()
    const socketIds = socketHandler!.usersSockets.get(userId)
    if(!socketIds || socketIds.length == 0) return;
    const socket = socketHandler!.clients.get(socketIds.at(-1)!)

    socket?.socket.emit(event, data, cb)
}