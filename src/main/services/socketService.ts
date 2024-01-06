import { Manager, Socket } from 'socket.io-client';
import { IDevice } from '../types/deviceTypes';
import { INotifyEvent } from '../types/notifyTypes';
import { BACKEND_SOCKET_URL } from '../constants/url';
// import { textUploadSuccessSchema } from '../schemas/googleDriveSchema';
// import { downloadFileFromGoogleDrive } from './googleDriveService';

let manager: Manager | null = null;
let socket: Socket | null = null;

function initializeManager(args: Pick<IDevice, 'mac'>): Manager {
  if (!manager) {
    manager = new Manager(BACKEND_SOCKET_URL, {
      reconnectionDelayMax: 10000,
      transports: ['websocket'],
      query: args,
    });
  }
  return manager;
}

type IRegisterCustomSocketEvent = {
  socket: Socket | null;
  event: string;
  callback: (...args: any[]) => void;
};

export function registerCustomSocketEvent({
  socket,
  event,
  callback,
}: IRegisterCustomSocketEvent): void {
  if (!socket) {
    throw new Error('Socket is not connected');
  }

  if (!socket.hasListeners(event)) {
    socket.on(event, callback);
    console.log(`[Socket] Register custom event: ${event}`);
  }
}

function setupSocketEventListeners(io: Socket): void {
  if (!io.hasListeners('connect')) {
    io.on('connect', () => {
      console.log(`[Socket Connected]`, io.connected);
      io.emit('ping', `[ping] ${new Date().toISOString()}`);
    });
  }

  if (!io.hasListeners('connect_error')) {
    io.on('connect_error', (err) => {
      console.error('[Socket Connected Error]', err);
    });
  }
  //
  // if (!io.hasListeners('pong')) {
  //   io.on('pong', (...args) => {
  //     console.log(`[Socket pong]`, args);
  //   });
  // }
  //
  // if (!io.hasListeners('paste')) {
  //   io.on('paste', (...args) => {
  //     console.log(`[Socket paste]`, args);
  //     const message = textUploadSuccessSchema.parse(args[0]);
  //
  //     const { content } = message;
  //     downloadFileFromGoogleDrive(content.id);
  //
  //     // Todo: download from googleDrive
  //   });
}

// Modify getSocket to use setupSocketEventListeners
function getSocket(args: Pick<IDevice, 'mac'>): Socket {
  if (!socket) {
    console.log(`Creating new socket connection`);
    const currentManager = initializeManager(args);
    socket = currentManager.socket('/');
    setupSocketEventListeners(socket);
  }

  return socket;
}

export function connectToDeviceSocketServer(
  args: Pick<IDevice, 'mac'>,
): Socket {
  if (!socket?.connected) socket = getSocket(args);

  return socket;
}

export function notifyToServer<T>(event: INotifyEvent, data: T): void {
  if (!socket) {
    throw new Error('Socket is not connected');
  }
  socket.emit(event, data);
}

export function removeSocketConnection(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  manager = null;
}
