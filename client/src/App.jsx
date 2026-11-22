import { useCallback, useEffect, useState } from 'react';
import { createLead, deleteLead, getStats, updateLead } from './api/leadsApi';
import ConfirmDialog from './components/ConfirmDialog';
import { PlusIcon } from './components/icons';
import LeadModal from './components/LeadModal';
import LeadsTable from './components/LeadsTable';
import Navbar from './components/Navbar';
import SearchFilterBar from './components/SearchFilterBar';
import StatsBar from './components/StatsBar';
import { useLeads } from './hooks/useLeads';

function App() {
  const {
    leads,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    refresh,
  } = useLeads();

  const [stats, setStats] = useState({ New: 0, Contacted: 0, Qualified: 0, Lost: 0 });
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);
  const [actionError, setActionError] = useState(null);

  const refreshStats = useCallback(async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch {
      // Stats failure should not block the main leads view
    }
  }, []);

  useEffect(() => {
    let active = true;
    getStats()
      .then((data) => {
        if (active) setStats(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setActionError(null);
    setEditingLead(null);
    setShowModal(true);
  };

  const handleOpenEdit = (lead) => {
    setActionError(null);
    setEditingLead(lead);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLead(null);
  };

  const handleSaveLead = async (formData) => {
    setActionError(null);
    try {
      if (editingLead) {
        await updateLead(editingLead.id, formData);
      } else {
        await createLead(formData);
      }
      await Promise.all([refresh(), refreshStats()]);
      handleCloseModal();
    } catch (err) {
      setActionError(err.message || 'Failed to save lead');
    }
  };

  const handleRequestDelete = (lead) => {
    setActionError(null);
    setDeletingLead(lead);
  };

  const handleConfirmDelete = async () => {
    if (!deletingLead) return;
    const targetId = deletingLead.id;
    setActionError(null);
    try {
      await deleteLead(targetId);
      setDeletingLead(null);
      await Promise.all([refresh(), refreshStats()]);
    } catch (err) {
      setActionError(err.message || 'Failed to delete lead');
      setDeletingLead(null);
    }
  };

  const displayError = actionError || error;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Leads</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Manage and track your sales pipeline
          </p>
        </div>

        <StatsBar stats={stats} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchFilterBar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 sm:shrink-0"
          >
            <PlusIcon className="h-4 w-4" />
            Add Lead
          </button>
        </div>

        {displayError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
          >
            {displayError}
          </div>
        )}

        <LeadsTable
          leads={leads}
          loading={loading}
          onEdit={handleOpenEdit}
          onDelete={handleRequestDelete}
          onAdd={handleOpenAdd}
        />
      </main>

      <LeadModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveLead}
        initialData={editingLead}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingLead)}
        message={
          deletingLead
            ? `Are you sure you want to delete "${deletingLead.name}"? This action cannot be undone.`
            : ''
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingLead(null)}
      />
    </div>
  );
}

export default App;
