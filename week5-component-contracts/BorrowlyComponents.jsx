import React, { useState } from 'react';

export function ItemListingCard({ itemName, condition, owner, available, onRequest }) {
  return (
    <article className="item-card" aria-label={`${itemName} listing`}>
      <h3>{itemName}</h3>
      <p>Condition: {condition}</p>
      <p>Owner: {owner}</p>
      <p>Availability: {available ? 'Available' : 'Unavailable'}</p>
      <button type="button" disabled={!available} onClick={onRequest}>
        {available ? 'Request to Borrow' : 'Unavailable'}
      </button>
    </article>
  );
}

export function BorrowRequestForm({ itemId, onSubmit }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  async function handleSubmit(event) {
    event.preventDefault();
    if (!startDate || !endDate || endDate < startDate) {
      setError('Choose valid dates: end date must be on or after start date.');
      return;
    }
    setError('');
    setSubmitting(true);
    try { await onSubmit({ itemId, startDate, endDate }); }
    catch { setError('Request could not be sent. Please try again.'); }
    finally { setSubmitting(false); }
  }
  return (
    <form onSubmit={handleSubmit} aria-label="Borrow request">
      <label htmlFor="borrow-start">Start date</label>
      <input id="borrow-start" type="date" required value={startDate}
        onChange={e => setStartDate(e.target.value)} />
      <label htmlFor="borrow-end">End date</label>
      <input id="borrow-end" type="date" required min={startDate || undefined}
        value={endDate} onChange={e => setEndDate(e.target.value)} />
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send Request'}
      </button>
    </form>
  );
}

export function RequestStatusBadge({ status }) {
  const labels = {
    pending: 'Pending', approved: 'Approved',
    declined: 'Declined', returned: 'Returned'
  };
  const label = labels[status] || 'Unknown';
  return <span className={`status-badge status-${status}`} role="status">
    Request status: {label}
  </span>;
}
