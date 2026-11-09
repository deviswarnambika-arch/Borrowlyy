import React, { useState } from "react";

/*
  Borrowly – Week 6 first-run prototype
  This is a front-end prototype. Login/sign-up is a demonstration screen only;
  it does not authenticate users or store account information.
*/

export function ItemListingCard({ itemName, condition, owner, available, onRequest }) {
  return (
    <article className="item-card" aria-label={`${itemName} listing`}>
      <h3>{itemName}</h3>
      <p>Condition: {condition}</p>
      <p>Owner: {owner}</p>
      <p>Availability: {available ? "Available" : "Unavailable"}</p>
      <button type="button" disabled={!available} onClick={onRequest}>
        {available ? "Request to Borrow" : "Unavailable"}
      </button>
    </article>
  );
}

export function BorrowRequestForm({ itemId, onSubmit }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!startDate || !endDate || endDate < startDate) {
      setError("Choose valid dates: end date must be on or after start date.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({ itemId, startDate, endDate });
    } catch {
      setError("Request could not be sent. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Borrow request" className="panel">
      <label htmlFor="borrow-start">Start date</label>
      <input id="borrow-start" type="date" required value={startDate}
        onChange={(e) => setStartDate(e.target.value)} />
      <label htmlFor="borrow-end">End date</label>
      <input id="borrow-end" type="date" required min={startDate || undefined}
        value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      <label htmlFor="pickup-location">Campus pickup location</label>
      <select id="pickup-location" required defaultValue="">
        <option value="" disabled>Select a campus pickup spot</option>
        <option>Library entrance</option>
        <option>Student center</option>
        <option>Main campus reception</option>
      </select>
      {error && <p role="alert" className="error">{error}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? "Sending..." : "Send Request"}
      </button>
    </form>
  );
}

export function RequestStatusBadge({ status }) {
  const labels = {
    pending: "Pending", approved: "Approved",
    declined: "Declined", returned: "Returned"
  };
  const label = labels[status] || "Unknown";
  return (
    <span className={`status-badge status-${status}`} role="status">
      Request status: {label}
    </span>
  );
}

const styles = `
  :root { font-family: Arial, sans-serif; color: #26352e; background: #f7f8f5; }
  * { box-sizing: border-box; }
  .borrowly { max-width: 920px; margin: 0 auto; padding: 28px 18px 56px; }
  .topbar { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:28px; }
  .brand { font-size:24px; font-weight:700; color:#304b3d; letter-spacing:-.5px; }
  .muted { color:#68766e; line-height:1.55; }
  .panel, .item-card { background:white; border:1px solid #e1e8e1; border-radius:16px; padding:22px; box-shadow:0 3px 12px #243b2b0a; }
  .narrow { max-width:560px; margin:30px auto; }
  h1 { font-size:clamp(28px, 5vw, 42px); margin:0 0 12px; color:#304b3d; }
  h2 { color:#304b3d; margin-top:0; }
  h3 { margin-top:0; }
  label { display:block; font-weight:600; margin:14px 0 6px; }
  input, select { width:100%; padding:12px; border:1px solid #cbd6cc; border-radius:9px; font:inherit; background:#fff; }
  button { border:0; border-radius:9px; background:#496b55; color:white; padding:12px 18px; font:inherit; font-weight:600; cursor:pointer; margin-top:14px; }
  button:hover { background:#385642; }
  button:disabled { opacity:.5; cursor:not-allowed; }
  button.secondary { background:#edf2ed; color:#304b3d; }
  button.text-button { background:transparent; color:#385642; padding:8px 0; text-decoration:underline; }
  .button-row { display:flex; flex-wrap:wrap; gap:10px; align-items:center; }
  .banner { background:#e8efe7; border:1px solid #d5e2d4; border-radius:12px; padding:14px 16px; display:flex; align-items:center; justify-content:space-between; gap:12px; margin:20px 0; }
  .banner p { margin:0; }
  .banner button { margin:0; white-space:nowrap; }
  .banner .dismiss { padding:6px 10px; background:transparent; color:#405847; }
  .steps { padding-left:24px; }
  .steps li { margin:14px 0; padding-left:5px; }
  .error { color:#a32e2e; }
  .status-badge { display:inline-block; padding:6px 10px; border-radius:20px; background:#edf2ed; }
  .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:16px; }
  .notice { background:#fff8e9; border-left:4px solid #d6a34b; padding:12px 14px; border-radius:8px; }
  .back { margin-bottom:18px; }
`;

function CampusPickupWalkthrough({ onClose }) {
  return (
    <div className="panel" role="dialog" aria-modal="true"
      aria-labelledby="pickup-title">
      <h2 id="pickup-title">How campus pickup works</h2>
      <ol className="steps">
        <li><strong>Send a request.</strong><br /><span className="muted">Choose an available item and submit your borrowing dates and pickup spot.</span></li>
        <li><strong>Wait for the owner.</strong><br /><span className="muted">The item owner reviews your request and responds.</span></li>
        <li><strong>Meet on campus.</strong><br /><span className="muted">Arrange the handoff and meet at the agreed public campus location.</span></li>
        <li><strong>Return it on time.</strong><br /><span className="muted">Return the item by the agreed date and let the owner know.</span></li>
      </ol>
      <p className="notice">Choose a public campus meeting place. Profiles and ratings do not guarantee someone's safety.</p>
      <button type="button" onClick={onClose}>Got it</button>
    </div>
  );
}

export default function BorrowlyWeek6() {
  const [screen, setScreen] = useState("welcome");
  const [showBanner, setShowBanner] = useState(true);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [requestSent, setRequestSent] = useState(false);

  const items = [
    { id: "calc-01", name: "Scientific Calculator", condition: "Good", owner: "Student owner", available: true },
    { id: "book-01", name: "Introduction to Business", condition: "Very good", owner: "Student owner", available: true },
    { id: "notes-01", name: "Notebook Set", condition: "Good", owner: "Student owner", available: false }
  ];

  function handleRequestSubmit(request) {
    // Front-end demonstration only. Connect this handler to a real backend
    // before describing requests as saved or sent to another student.
    console.log("Prototype request:", request);
    setRequestSent(true);
    setScreen("confirmation");
    return Promise.resolve();
  }

  return (
    <>
      <style>{styles}</style>
      <main className="borrowly">
        <header className="topbar">
          <div className="brand">Borrowly</div>
          {screen !== "welcome" && (
            <button className="secondary" type="button" onClick={() => setScreen("home")}>
              Browse items
            </button>
          )}
        </header>

        {screen === "welcome" && (
          <section className="panel narrow">
            <h1>Borrow what you need. Share what you have.</h1>
            <p className="muted">A student-focused way to borrow academic essentials for temporary use.</p>
            <button type="button" onClick={() => setScreen("account")}>Start borrowing</button>
          </section>
        )}

        {screen === "account" && (
          <section className="panel narrow">
            <h2>Login / Sign-Up</h2>
            <p className="muted">This is a front-end prototype screen. No account is created and no credentials are collected.</p>
            <label htmlFor="student-email">Student email (example only)</label>
            <input id="student-email" type="email" placeholder="name@example.edu" />
            <div className="button-row">
              <button type="button" onClick={() => setScreen("privacy")}>Continue to privacy</button>
              <button className="secondary" type="button" onClick={() => setScreen("welcome")}>Back</button>
            </div>
          </section>
        )}

        {screen === "privacy" && (
          <section className="panel narrow">
            <h2>Your privacy matters</h2>
            <p className="muted">For this basic borrowing flow, students choose their dates and campus pickup location themselves.</p>
            <ul>
              <li>No contacts access is needed.</li>
              <li>No camera or microphone access is needed.</li>
              <li>No precise device location access is needed.</li>
              <li>Choose a public campus pickup place.</li>
            </ul>
            <button type="button" onClick={() => setScreen("home")}>Continue to Borrowly</button>
          </section>
        )}

        {screen === "home" && (
          <>
            <h1>Find what you need</h1>
            <p className="muted">Browse academic essentials shared by other students.</p>

            {showBanner && (
              <aside className="banner">
                <p><strong>New to Borrowly?</strong> See how campus pickup works in 4 quick steps.</p>
                <div className="button-row">
                  <button type="button" onClick={() => setShowWalkthrough(true)}>How it works</button>
                  <button className="dismiss" type="button" aria-label="Dismiss campus pickup tip"
                    onClick={() => setShowBanner(false)}>×</button>
                </div>
              </aside>
            )}

            {showWalkthrough && (
              <CampusPickupWalkthrough onClose={() => setShowWalkthrough(false)} />
            )}

            <div className="grid" style={{ marginTop: 20 }}>
              {items.map((item) => (
                <ItemListingCard key={item.id} itemName={item.name}
                  condition={item.condition} owner={item.owner}
                  available={item.available}
                  onRequest={() => { setSelectedItem(item); setScreen("details"); }} />
              ))}
            </div>
          </>
        )}

        {screen === "details" && selectedItem && (
          <section className="panel narrow">
            <button className="text-button back" type="button" onClick={() => setScreen("home")}>← Back to items</button>
            <h2>{selectedItem.name}</h2>
            <p>Condition: {selectedItem.condition}</p>
            <p>Owner: {selectedItem.owner}</p>
            <p>Collection: Campus pickup</p>
            <button className="text-button" type="button" onClick={() => setShowWalkthrough(true)}>
              How campus pickup works
            </button>
            {showWalkthrough && <CampusPickupWalkthrough onClose={() => setShowWalkthrough(false)} />}
            <button type="button" onClick={() => setScreen("request")}>Continue to request</button>
          </section>
        )}

        {screen === "request" && selectedItem && (
          <section className="narrow">
            <button className="text-button back" type="button" onClick={() => setScreen("details")}>← Back to item</button>
            <h2>Request {selectedItem.name}</h2>
            <button className="text-button" type="button" onClick={() => setShowWalkthrough(true)}>
              How campus pickup works
            </button>
            {showWalkthrough && <CampusPickupWalkthrough onClose={() => setShowWalkthrough(false)} />}
            <BorrowRequestForm itemId={selectedItem.id} onSubmit={handleRequestSubmit} />
          </section>
        )}

        {screen === "confirmation" && (
          <section className="panel narrow">
            <h2>{requestSent ? "Request submitted in prototype" : "Request"}</h2>
            <p className="muted">This is a front-end demonstration. The request is not saved or sent to a real item owner.</p>
            <RequestStatusBadge status="pending" />
            <div><button type="button" onClick={() => { setRequestSent(false); setSelectedItem(null); setScreen("home"); }}>Back to browsing</button></div>
          </section>
        )}
      </main>
    </>
  );
}
