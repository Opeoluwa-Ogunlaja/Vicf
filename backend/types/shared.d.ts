import { NextFunction, Request, Response } from 'express'
import { Socket } from 'socket.io'
import { IUserDocument } from './user'

export type ResponseWithSuccess<T> = { ok: boolean; data?: T; message?: string }
export type AsyncHandler<
  RequestBody = any,
  ResponseBody = any,
  RequestParams = {},
  RequestQuery = {}
> = (
  req: Request<RequestParams, ResponseWithSuccess<ResponseBody>, RequestBody, RequestQuery>,
  res: Response<ResponseWithSuccess<ResponseBody>>,
  next?: NextFunction
) => Promise<any> | any

export type SocketClientValue = {
  socket: Socket
  user?: IUserDocument
  socketId: string
}

export type SocketClients = Map<string, SocketClientValue>
export type SocketUsers = Map<string, string>
export type SocketHandlerFn<MessageType = any> = (
  message: MessageType,
  socket: Socket,
  clients: SocketClients,
  userSockets: SocketUsers,
  next: (err?: any) => void,
  ...args: any[]
) => Promise<void>

export type ConstructorParam<T, Index extends number> = ConstructorParameters<T>[Index]
