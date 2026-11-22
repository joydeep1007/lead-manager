const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'];

function SearchFilterBar({ search, onSearchChange, statusFilter, onStatusChange }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by name or email…"
        aria-label="Search leads"
        className="w-full flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        aria-label="Filter by status"
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:w-48"
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
