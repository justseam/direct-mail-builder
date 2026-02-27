import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Send, Mail, BarChart3, Calendar, Users, Settings,
} from 'lucide-react';
import { cn } from '../../utils';

const navItems = [
  { icon: Home, path: '/home', label: 'Home' },
  { icon: Send, path: '/send', label: 'Send' },
  { icon: Mail, path: '/', label: 'Mail' },
  { icon: BarChart3, path: '/analytics', label: 'Analytics' },
  { icon: Calendar, path: '/calendar', label: 'Calendar' },
  { icon: Users, path: '/audiences', label: 'People' },
  { icon: Settings, path: '/settings', label: 'Settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string, label: string) => {
    if (label === 'Mail') return location.pathname === '/' || location.pathname.startsWith('/templates') || location.pathname.startsWith('/campaigns');
    if (label === 'People') return location.pathname.startsWith('/audiences');
    return location.pathname === path;
  };

  return (
    <aside className="w-16 bg-sidebar-bg border-r border-border flex flex-col items-center py-4 gap-1 shrink-0">
      <div className="w-9 h-9 rounded-[8px] bg-primary flex items-center justify-center mb-6">
        <Mail className="w-5 h-5 text-white" />
      </div>

      <nav className="flex flex-col items-center gap-1 flex-1">
        {navItems.map(({ icon: Icon, path, label }) => {
          const active = isActive(path, label);
          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              title={label}
              className={cn(
                'w-11 h-11 flex items-center justify-center rounded-[10px] transition-colors cursor-pointer group relative',
                active ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-gray-200/60',
              )}
            >
              {active && (
                <span className="absolute left-0 w-[3px] h-6 bg-primary rounded-r-full" />
              )}
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
