const STAT_CARDS = [
  { key: 'New', label: 'New', dotClass: 'bg-blue-500' },
  { key: 'Contacted', label: 'Contacted', dotClass: 'bg-yellow-500' },
  { key: 'Qualified', label: 'Qualified', dotClass: 'bg-green-500' },
  { key: 'Lost', label: 'Lost', dotClass: 'bg-red-500' },
];

function StatsBar({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {STAT_CARDS.map(({ key, label, dotClass }) => (
        <div
          key={key}
          className="flex flex-col gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-3"
        >
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} aria-hidden="true" />
            <span className="text-xs font-medium text-gray-500">{label}</span>
          </div>
          <p className="tabular-nums text-2xl font-semibold text-gray-900">
            {stats?.[key] ?? 0}
          </p>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;
