import { ChartBarIcon, FunnelIcon, SettingsIcon, UsersIcon } from './icons';

const NAV_ITEMS = [
  { key: 'leads', label: 'Leads', icon: UsersIcon, active: true },
  { key: 'pipeline', label: 'Pipeline', icon: FunnelIcon, active: false },
  { key: 'analytics', label: 'Analytics', icon: ChartBarIcon, active: false },
  { key: 'settings', label: 'Settings', icon: SettingsIcon, active: false },
];

function Navbar() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-semibold text-white">
            LM
          </span>
          <span className="text-base font-semibold text-gray-900">Lead Manager</span>
        </div>

        <nav aria-label="Primary" className="flex items-center gap-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon, active }) => (
            <span
              key={key}
              aria-current={active ? 'page' : undefined}
              aria-disabled={active ? undefined : 'true'}
              title={active ? undefined : `${label} (coming soon)`}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-3 ${
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-400'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </span>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
