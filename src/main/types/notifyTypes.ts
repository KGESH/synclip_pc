export type INotifyEvent = 'ping' | 'pong' | 'copy' | 'paste';

export type INotify<T> = {
  userId: string;
  event: INotifyEvent;
  data: T;
};
