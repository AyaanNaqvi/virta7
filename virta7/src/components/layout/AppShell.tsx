import { Outlet } from 'react-router-dom';
import { BottomNav } from '../nav/BottomNav';

export function AppShell() {
  return (
    <div className="flex min-h-svh flex-col">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
