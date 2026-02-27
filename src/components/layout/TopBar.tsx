import { Settings, Bell, User } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-end px-4 gap-2 shrink-0">
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
