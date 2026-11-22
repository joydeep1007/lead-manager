const STAT_CARDS = [
  { key: 'New', label: 'New', countClass: 'text-blue-400' },
  { key: 'Contacted', label: 'Contacted', countClass: 'text-yellow-400' },
  { key: 'Qualified', label: 'Qualified', countClass: 'text-green-400' },
  { key: 'Lost', label: 'Lost', countClass: 'text-red-400' },
];

function StatsBar({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
      {STAT_CARDS.map(({ key, label, countClass }) => (
        <div
          key={key}
          className="flex flex-col gap-1 rounded-xl border border-gray-800 bg-gray-900 px-6 py-4"
        >
          <span className="text-sm font-medium text-gray-400">{label}</span>
          <p className={`text-3xl font-bold ${countClass}`}>
            {stats?.[key] ?? 0}
          </p>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;
