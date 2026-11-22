const STATUS_COLORS = {
  New: 'bg-blue-900/50 text-blue-300',
  Contacted: 'bg-yellow-900/50 text-yellow-300',
  Qualified: 'bg-green-900/50 text-green-300',
  Lost: 'bg-red-900/50 text-red-300',
};

function LeadsTable({ leads = [], onEdit, onDelete }) {
  if (!leads || leads.length === 0) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900 py-16 text-center text-gray-500">
        No leads found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-800 text-xs uppercase tracking-wide text-gray-400">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">Name</th>
            <th scope="col" className="px-4 py-3 font-medium">Email</th>
            <th scope="col" className="px-4 py-3 font-medium">Phone</th>
            <th scope="col" className="px-4 py-3 font-medium">Company</th>
            <th scope="col" className="px-4 py-3 font-medium">Source</th>
            <th scope="col" className="px-4 py-3 font-medium">Status</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-t border-gray-800 even:bg-gray-800/40">
              <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-200">
                {lead.name}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-200">
                {lead.email}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-200">
                {lead.phone || '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-200">
                {lead.company || '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-200">
                {lead.source}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-200">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    STATUS_COLORS[lead.status] || 'bg-gray-800 text-gray-300'
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
                    className="rounded border border-indigo-800 px-3 py-1 text-xs font-medium text-indigo-400 transition-colors hover:border-indigo-600 hover:text-indigo-300"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(lead)}
                    className="rounded border border-red-900 px-3 py-1 text-xs font-medium text-red-400 transition-colors hover:border-red-700 hover:text-red-300"
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
