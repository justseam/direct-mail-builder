import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';

export default function AppShell() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-page-bg">
      <TopBar />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}
