import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { session } from '../../lib/session';

export default function LoginModal({ show, onSuccess }: { show: boolean; onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const ok = await session.login(email, password);
      if (ok) {
        setEmail('');
        setPassword('');
        onSuccess();
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal show={show} backdrop="static" keyboard={false} centered contentClassName="rounded-4">
      <Modal.Body>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label htmlFor="loginEmail" className="form-label my-1">
              <i className="fa-solid fa-envelope me-2"></i>Email
            </label>
            <input
              type="email"
              className="form-control shadow-sm rounded-4"
              id="loginEmail"
              minLength={5}
              maxLength={254}
              placeholder="Enter your email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="loginPassword" className="form-label my-1">
              <i className="fa-solid fa-lock me-2"></i>Password
            </label>
            <input
              type="password"
              className="form-control shadow-sm rounded-4"
              id="loginPassword"
              minLength={8}
              maxLength={20}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary shadow-sm rounded-4" disabled={busy}>
              {busy ? (
                <span className="spinner-border spinner-border-sm me-2" style={{ height: '0.8rem', width: '0.8rem' }} />
              ) : (
                <i className="fa-solid fa-right-to-bracket me-2"></i>
              )}
              Login
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
