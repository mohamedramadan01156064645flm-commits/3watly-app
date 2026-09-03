import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  MenuIcon,
  SearchIcon,
  BellIcon,
  ChevronDownIcon,
  XIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  CheckCheckIcon } from
'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { searchIndex, SearchEntry } from '../../data/market';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { resolveDisplayName } from '@/utils/formatName';

type TopBarProps = {
  onSearchSelect: (entry: SearchEntry) => void;
  onToggleNav: () => void;
  navCollapsed: boolean;
};

export function TopBar({ onSearchSelect, onToggleNav, navCollapsed }: TopBarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [bellOpen, setBellOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const displayName = resolveDisplayName({
    fullName: user?.fullName,
    email: user?.email
  });
  const roleName = user?.targetRole || 'Data Professional';

  const searchRef = useClickOutside<HTMLDivElement>(searchOpen, () => setSearchOpen(false));
  const bellRef = useClickOutside<HTMLDivElement>(bellOpen, () => setBellOpen(false));
  const userRef = useClickOutside<HTMLDivElement>(userOpen, () => setUserOpen(false));

  const unread = unreadCount;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchIndex.slice(0, 5);
    return searchIndex.filter((e) => e.label.toLowerCase().includes(q) || e.type.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  const pickResult = (entry: SearchEntry) => {
    setQuery(entry.label);
    setSearchOpen(false);
    onSearchSelect(entry);
  };

  return (
    <header className="sticky top-0 z-20 flex h-[68px] shrink-0 items-center gap-4 border-b border-line bg-white px-6">
      <button
        type="button"
        onClick={onToggleNav}
        aria-label={navCollapsed ? 'Show filters and sections' : 'Hide filters and sections'}
        aria-pressed={navCollapsed}
        className="flex h-9 w-9 items-center justify-center rounded-[9px] text-ink-700 transition-colors duration-150 ease-out hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-100">
        
        <MenuIcon className="h-5 w-5" strokeWidth={2} />
      </button>

      <div ref={searchRef} className="relative mx-auto w-full max-w-[540px]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (results.length > 0) pickResult(results[0]);
          }}>
          
          <label className="relative block">
            <span className="sr-only">Search skills, roles and companies</span>
            <SearchIcon
              className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-ink-400"
              strokeWidth={2} />
            
            <input
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search for skills, roles, companies..."
              className="h-[40px] w-full rounded-[10px] border border-line bg-white pl-11 pr-10 text-[13.5px] text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" />
            
            {query &&
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSearchOpen(false);
              }}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-ink-400 transition-colors duration-150 ease-out hover:bg-canvas hover:text-ink-900">
              
                <XIcon className="h-4 w-4" strokeWidth={2.2} />
              </button>
            }
          </label>
        </form>

        <AnimatePresence>
          {searchOpen &&
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            className="absolute left-0 right-0 top-[46px] z-30 rounded-[12px] border border-line bg-white p-1.5 shadow-pop">
            
              {results.length === 0 ?
            <p className="px-3 py-4 text-[13px] text-ink-500">
                  No matches for “{query}”. Try a skill, role or company.
                </p> :

            <ul>
                  {results.map((entry) =>
              <li key={`${entry.type}-${entry.label}`}>
                      <button
                  type="button"
                  onClick={() => pickResult(entry)}
                  className="flex w-full items-center gap-3 rounded-[8px] px-2.5 py-2 text-left transition-colors duration-150 ease-out hover:bg-canvas">
                  
                        <span className="w-[62px] shrink-0 rounded-[6px] bg-canvas px-2 py-[3px] text-center text-[10.5px] font-bold uppercase tracking-wide text-ink-500">
                          {entry.type}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-semibold text-ink-900">{entry.label}</span>
                          <span className="block truncate text-[11.5px] text-ink-400">{entry.meta}</span>
                        </span>
                      </button>
                    </li>
              )}
                </ul>
            }
            </motion.div>
          }
        </AnimatePresence>
      </div>

      <div ref={bellRef} className="relative">
        <button
          type="button"
          onClick={() => setBellOpen((v) => !v)}
          aria-label={`Notifications, ${unread} unread`}
          aria-expanded={bellOpen}
          className="relative flex h-9 w-9 items-center justify-center rounded-[9px] text-ink-700 transition-colors duration-150 ease-out hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-100">
          
          <BellIcon className="h-[19px] w-[19px]" strokeWidth={1.9} />
          {unread > 0 &&
          <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
              {unread}
            </span>
          }
        </button>

        <AnimatePresence>
          {bellOpen &&
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            className="absolute right-0 top-[44px] z-30 w-[352px] overflow-hidden rounded-[12px] border border-line bg-white shadow-pop">
            
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <p className="text-[13.5px] font-bold text-ink-900">Notifications</p>
                <button
                type="button"
                disabled={unread === 0}
                onClick={() => {
                  markAllAsRead();
                  toast.success('All notifications marked as read');
                }}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-brand-600 transition-colors duration-150 ease-out hover:text-brand-700 disabled:cursor-not-allowed disabled:text-ink-400">
                
                  <CheckCheckIcon className="h-[14px] w-[14px]" strokeWidth={2.2} />
                  Mark all read
                </button>
              </div>

              <ul className="max-h-[320px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <li className="px-4 py-6 text-center text-[12.5px] text-ink-500">
                    No new matched job alerts
                  </li>
                ) : (
                  notifications.map((n) =>
                    <li key={n.id} className="border-b border-line last:border-b-0">
                      <button
                        type="button"
                        onClick={() => {
                          markAsRead(n.id);
                          setBellOpen(false);
                          router.push(n.url);
                        }}
                        className={`flex w-full gap-2.5 px-4 py-3 text-left transition-colors duration-150 ease-out hover:bg-canvas ${
                          n.read ? 'opacity-75' : 'bg-brand-50/40'
                        }`}>
                        
                        <span
                          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${!n.read ? 'bg-brand-600' : 'bg-transparent'}`} />
                        
                        <span className="min-w-0 flex-1">
                          <span className={`block text-[13px] ${!n.read ? 'font-bold text-ink-900' : 'font-semibold text-ink-700'} truncate`}>
                            {n.title}
                          </span>
                          <span className="mt-0.5 block text-[12px] leading-[1.5] text-ink-500 line-clamp-1">{n.description}</span>
                          <span className="mt-1 block text-[11px] text-ink-400">{n.time}</span>
                        </span>
                      </button>
                    </li>
                  )
                )}
              </ul>

              <div className="border-t border-line p-2">
                <button
                type="button"
                onClick={() => {
                  setBellOpen(false);
                  router.push('/alerts');
                }}
                className="h-9 w-full rounded-[8px] text-[13px] font-semibold text-brand-600 transition-colors duration-150 ease-out hover:bg-brand-50">
                
                  Manage alert settings
                </button>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </div>

      <div ref={userRef} className="relative">
        <button
          type="button"
          onClick={() => setUserOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={userOpen}
          className="flex items-center gap-2.5 rounded-[10px] py-1 pl-1 pr-2 transition-colors duration-150 ease-out hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-100">
          
          <UserAvatar avatarUrl={user?.avatarUrl} name={displayName} size="sm" />
          <span className="text-left">
            <span className="block text-[13.5px] font-semibold leading-tight text-ink-900">{displayName}</span>
            <span className="block text-[11.5px] leading-tight text-ink-500">{roleName}</span>
          </span>
          <ChevronDownIcon
            className={`h-4 w-4 text-ink-400 transition-transform duration-150 ease-out ${userOpen ? 'rotate-180' : ''}`} />
          
        </button>

        <AnimatePresence>
          {userOpen &&
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            className="absolute right-0 top-[52px] z-30 w-[220px] rounded-[12px] border border-line bg-white p-1.5 shadow-pop">
            
              <div className="border-b border-line px-2.5 pb-2.5 pt-1.5">
                <p className="text-[13px] font-semibold text-ink-900">{displayName}</p>
                <p className="text-[11.5px] text-ink-500 truncate">{user?.email || '3WATLY Account'}</p>
              </div>
              <div className="pt-1.5">
                <UserMenuItem
                icon={UserIcon}
                label="View profile"
                onClick={() => {
                  setUserOpen(false);
                  router.push('/dashboard');
                }} />
              
                <UserMenuItem
                icon={SettingsIcon}
                label="Account settings"
                onClick={() => {
                  setUserOpen(false);
                  router.push('/settings');
                }} />
              
                <UserMenuItem
                icon={LogOutIcon}
                label="Sign out"
                danger
                onClick={async () => {
                  setUserOpen(false);
                  await logout();
                  toast.success('Signed out of 3WATLY');
                  router.push('/login');
                }} />
              
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </header>);

}

function UserMenuItem({
  icon: Icon,
  label,
  onClick,
  danger





}: {icon: React.ComponentType<{className?: string;strokeWidth?: number;}>;label: string;onClick: () => void;danger?: boolean;}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-[8px] px-2.5 py-2 text-left text-[13px] font-medium transition-colors duration-150 ease-out hover:bg-canvas ${
      danger ? 'text-[#DC2626]' : 'text-ink-700'}`
      }>
      
      <Icon className="h-[16px] w-[16px]" strokeWidth={2} />
      {label}
    </button>);

}