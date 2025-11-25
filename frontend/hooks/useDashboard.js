import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import { ensureNotPastDate } from '../domain/rules/appointmentRules';

export default function useDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiFetch('/appointments')
      .then((data) => {
        if (!active) return;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((e) => active && setError(e))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const createAppointment = async (payload) => {
    ensureNotPastDate(payload.date);
    return apiFetch('/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  };

  return { items, loading, error, createAppointment };
}
