const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'];

function SearchFilterBar({ search, onSearchChange, statusFilter, onStatusChange }) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by name or email…"
        aria-label="Search leads"
        className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        aria-label="Filter by status"
        className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:w-48"
      >
        <option value="">All Statuses</option>
        {LEAD_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SearchFilterBar;
