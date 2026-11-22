const STAT_CARDS = [
  { key: 'New', label: 'New', badgeClass: 'bg-blue-100 text-blue-800' },
  { key: 'Contacted', label: 'Contacted', badgeClass: 'bg-yellow-100 text-yellow-800' },
  { key: 'Qualified', label: 'Qualified', badgeClass: 'bg-green-100 text-green-800' },
  { key: 'Lost', label: 'Lost', badgeClass: 'bg-red-100 text-red-800' },
];

function StatsBar({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {STAT_CARDS.map(({ key, label, badgeClass }) => (
        <div
          key={key}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}
          >
            {label}
          </span>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {stats?.[key] ?? 0}
          </p>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;
