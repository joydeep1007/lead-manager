// Minimal inline icon set (no external icon package) used across the app shell.
// All icons are decorative; consumers should keep aria-hidden semantics intact.

function baseProps(props) {
  return {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
    focusable: 'false',
    ...props,
  };
}

export function UsersIcon(props) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <circle cx="17" cy="9" r="2.3" />
      <path d="M15.3 13.6c2.4 0.2 4.3 2 4.7 4.4" />
    </svg>
  );
}

export function FunnelIcon(props) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 5h16l-6 7.2V19l-4 2v-8.8L4 5Z" />
    </svg>
  );
}

export function ChartBarIcon(props) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 20V11M10 20V5M16 20v-6M3 20h18" />
    </svg>
  );
}

export function SettingsIcon(props) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13a7.1 7.1 0 0 0 0-2l1.9-1.5-2-3.4-2.2.9a7 7 0 0 0-1.7-1l-.3-2.3h-4l-.3 2.3a7 7 0 0 0-1.7 1l-2.2-.9-2 3.4L4.6 11a7.1 7.1 0 0 0 0 2l-1.9 1.5 2 3.4 2.2-.9c.5.4 1.1.8 1.7 1l.3 2.3h4l.3-2.3c.6-.2 1.2-.6 1.7-1l2.2.9 2-3.4-1.9-1.5Z" />
    </svg>
  );
}

export function PlusIcon(props) {
  return (
    <svg {...baseProps({ strokeWidth: 2, ...props })}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

export function InboxIcon(props) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 12.5h4.3l1.3 2.5h4.8l1.3-2.5H20" />
      <path d="M5.8 5.5h12.4L20 12.5v5.7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5.7L5.8 5.5Z" />
    </svg>
  );
}
