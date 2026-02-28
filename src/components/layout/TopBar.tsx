import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, Settings, Bell, User } from 'lucide-react';
import { cn } from '../../utils';

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isDirectMail =
    location.pathname === '/' ||
    location.pathname.startsWith('/templates') ||
    location.pathname.startsWith('/campaigns') ||
    location.pathname.startsWith('/audiences');

  return (
    <header className="h-14 bg-white border-b border-border flex items-center px-4 gap-3 shrink-0">
      {/* Logo */}
      <button
        onClick={() => navigate('/')}
        className="w-9 h-9 rounded-[8px] bg-primary flex items-center justify-center shrink-0 cursor-pointer"
      >
        <Mail className="w-5 h-5 text-white" />
      </button>

      {/* Nav items */}
      <nav className="flex items-center gap-1 ml-2">
        <button
          onClick={() => navigate('/')}
          className={cn(
            'px-3 py-2 text-[14px] font-medium rounded-[8px] transition-colors cursor-pointer',
            isDirectMail
              ? 'text-primary bg-primary/10'
              : 'text-text-secondary hover:bg-gray-100',
          )}
        >
          Direct Mail
        </button>
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <button className="p-2 hover:bg-gray-100 rounded-full text-text-secondary cursor-pointer">
        <Settings className="w-5 h-5" />
      </button>
      <button className="p-2 hover:bg-gray-100 rounded-full text-text-secondary cursor-pointer relative">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>
      <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary cursor-pointer ml-1">
        <User className="w-4 h-4" />
      </button>
    </header>
  );
}
