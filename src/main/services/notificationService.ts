import { Notification } from 'electron';

export function showSystemNotification({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  new Notification({ title, body: message }).show();
}
