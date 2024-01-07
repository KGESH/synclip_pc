import { ReactNode } from 'react';
import { Route } from 'electron-router-dom';

export default function AppRoute({
  path,
  children,
}: {
  path: string;
  children: ReactNode;
}) {
  return <Route path={path} element={children} />;
}
