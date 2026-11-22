import { useEffect, useState } from 'react';

const LEAD_SOURCES = ['Website', 'Referral', 'Cold Call', 'Social', 'Other'];
const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  company: '',
  source: 'Website',
  status: 'New',
};

function getInitialForm(initialData) {
  if (!initialData) return EMPTY_FORM;
  return {
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    company: initialData.company || '',
    source: LEAD_SOURCES.includes(initialData.source) ? initialData.source : 'Website',
    status: LEAD_STATUSES.includes(initialData.status) ? initialData.status : 'New',
  };
}

function LeadModal({ isOpen, onClose, onSave, initialData = null }) {
  if (!isOpen) return null;

  return (
    <LeadModalContent
      key={initialData?.id ?? 'new'}
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
    />
  );
}

function LeadModalContent({ onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(() => getInitialForm(initialData));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !saving) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, saving]);

  const isEditMode = Boolean(initialData);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) {
      nextErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      nextErrors.email = 'Please enter a valid email address';
    }
    if (!LEAD_SOURCES.includes(formData.source)) {
      nextErrors.source = 'Please select a valid source';
    }
    if (!LEAD_STATUSES.includes(formData.status)) {
      nextErrors.status = 'Please select a valid status';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || saving) return;
    setSaving(true);
    try {
      await onSave({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !saving) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
    >
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="lead-modal-title" className="text-base font-semibold text-gray-900">
            {isEditMode ? 'Edit Lead' : 'Add Lead'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="lead-name" className="mb-1 block text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lead-name"
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              disabled={saving}
              placeholder="Jane Doe"
              className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-500/20'
                  : 'border-gray-300 focus:border-indigo-400 focus:ring-indigo-500/20'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="lead-email" className="mb-1 block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="lead-email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              disabled={saving}
              placeholder="jane@company.com"
              className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-500/20'
                  : 'border-gray-300 focus:border-indigo-400 focus:ring-indigo-500/20'
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="lead-phone" className="mb-1 block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                id="lead-phone"
                type="text"
                value={formData.phone}
                onChange={handleChange('phone')}
                disabled={saving}
                placeholder="+1 (555) 123-4567"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label htmlFor="lead-company" className="mb-1 block text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                id="lead-company"
                type="text"
                value={formData.company}
                onChange={handleChange('company')}
                disabled={saving}
                placeholder="Acme Inc."
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="lead-source" className="mb-1 block text-sm font-medium text-gray-700">
                Source
              </label>
              <select
                id="lead-source"
                value={formData.source}
                onChange={handleChange('source')}
                disabled={saving}
                className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
                  errors.source
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-500/20'
                    : 'border-gray-300 focus:border-indigo-400 focus:ring-indigo-500/20'
                }`}
              >
                {LEAD_SOURCES.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
              {errors.source && <p className="mt-1 text-xs text-red-600">{errors.source}</p>}
            </div>

            <div>
              <label htmlFor="lead-status" className="mb-1 block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="lead-status"
                value={formData.status}
                onChange={handleChange('status')}
                disabled={saving}
                className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
                  errors.status
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-500/20'
                    : 'border-gray-300 focus:border-indigo-400 focus:ring-indigo-500/20'
                }`}
              >
                {LEAD_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status}</p>}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-60"
          >
            {saving && (
              <svg
                className="h-4 w-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeadModal;
