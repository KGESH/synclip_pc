import React from 'react';
import QueryProvider from './components/reactQuery/QueryProvider';
import AppRouter from './routes/AppRouter';
import './App.css';

export default function App() {
  return <QueryProvider>{AppRouter()}</QueryProvider>;
}
