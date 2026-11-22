import { InboxIcon, PlusIcon } from './icons';

const STATUS_COLORS = {
  New: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
  Contacted: 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-200',
  Qualified: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-200',
  Lost: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
};

const COLUMN_COUNT = 6;

// Leads don't carry a dedicated "last contacted" field; updated_at is the closest
// real signal (it reflects whenever the record was last created or edited).
function formatLastContacted(value) {
  if (!value) return '—';
  const isoLike = value.includes('T') ? value : `${value.replace(' ', 'T')}Z`;
  const date = new Date(isoLike);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);
}

function LeadsTable({ leads = [], loading = false, onEdit, onDelete, onAdd }) {
  const safeLeads = Array.isArray(leads) ? leads : [];

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500">
            <tr>
              <th scope="col" className="px-4 py-2.5">Name</th>
              <th scope="col" className="px-4 py-2.5">Email</th>
              <th scope="col" className="px-4 py-2.5">Company</th>
              <th scope="col" className="px-4 py-2.5">Status</th>
              <th scope="col" className="px-4 py-2.5">Last Contacted</th>
              <th scope="col" className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={COLUMN_COUNT} className="px-4 py-14 text-center text-sm text-gray-500">
                  Loading leads...
                </td>
              </tr>
            ) : safeLeads.length === 0 ? (
              <tr>
                <td colSpan={COLUMN_COUNT} className="px-4 py-12">
                  <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      <InboxIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-900">No leads yet</p>
                      <p className="text-sm text-gray-500">
                        Add your first lead manually or import a CSV to start tracking your
                        pipeline.
                      </p>
                    </div>
                    {onAdd && (
                      <button
                        type="button"
                        onClick={onAdd}
                        className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
                      >
                        <PlusIcon className="h-4 w-4" />
                        Add Lead
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              safeLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                    {lead.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">{lead.email}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {lead.company || '—'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        STATUS_COLORS[lead.status] ||
                        'bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="tabular-nums whitespace-nowrap px-4 py-3 text-gray-600">
                    {formatLastContacted(lead.updated_at)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(lead)}
                        className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(lead)}
                        className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeadsTable;
