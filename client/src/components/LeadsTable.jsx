const STATUS_COLORS = {
  New: 'bg-blue-100 text-blue-800',
  Contacted: 'bg-yellow-100 text-yellow-800',
  Qualified: 'bg-green-100 text-green-800',
  Lost: 'bg-red-100 text-red-800',
};

function LeadsTable({ leads = [], onEdit, onDelete }) {
  if (!leads || leads.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500 shadow-sm">
        No leads found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
          <tr>
            <th scope="col" className="px-4 py-3">Name</th>
            <th scope="col" className="px-4 py-3">Email</th>
            <th scope="col" className="px-4 py-3">Phone</th>
            <th scope="col" className="px-4 py-3">Company</th>
            <th scope="col" className="px-4 py-3">Source</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                {lead.name}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                {lead.email}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                {lead.phone || '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                {lead.company || '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                {lead.source}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    STATUS_COLORS[lead.status] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {lead.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(lead)}
                    className="rounded-md px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(lead)}
                    className="rounded-md px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeadsTable;
