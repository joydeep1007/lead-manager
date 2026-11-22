import { useCallback, useEffect, useState } from 'react';
import { getLeads } from '../api/leadsApi';

export function useLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeads(search, statusFilter);
      setLeads(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    let cancelled = false;

    getLeads(search, statusFilter)
      .then((data) => {
        if (!cancelled) setLeads(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to fetch leads');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search, statusFilter]);

  return {
    leads,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    refresh,
  };
}

export default useLeads;
