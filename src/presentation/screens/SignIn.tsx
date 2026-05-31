import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../application/stores/authStore';
import { ArrowRight, Fingerprint } from '../components/ui/Icons';
import './SignIn.css';

export function SignIn() {
  const navigate = useNavigate();
  const signIn = useAuthStore((s) => s.signIn);

  const [employeeId, setEmployeeId] = useState('08412');
  const [password, setPassword] = useState('demo1234');
  const [submitting, setSubmitting] = useState(false);

  const valid = employeeId.length >= 4 && password.length >= 4;

  const handleSubmit = async () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    // small delay for tactile feel
    await new Promise((r) => setTimeout(r, 500));
    await signIn();
    navigate('/home', { replace: true });
  };

  return (
    <div className="signin">
      <div className="signin__hero">
        <div className="signin__brand">
          <div className="signin__glyph">B</div>
          <span>Backpack</span>
        </div>
        <div className="signin__welcome">
          Welcome
          <br />
          back, <em>operative.</em>
        </div>
        <div className="signin__sub">
          Sign in to start logging today's site activity.
        </div>
      </div>

      <div className="signin__card">
        <div className="signin__field">
          <label className="signin__label" htmlFor="employee-id">
            Employee ID
          </label>
          <input
            id="employee-id"
            className="signin__input"
            value={`JMCC-${employeeId}`}
            onChange={(e) =>
              setEmployeeId(e.target.value.replace(/^JMCC-/, '').toUpperCase())
            }
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div className="signin__field">
          <label className="signin__label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="signin__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            autoComplete="current-password"
          />
        </div>
        <div className="signin__row-link">Forgot password?</div>
        <button
          className="signin__btn"
          onClick={handleSubmit}
          disabled={!valid || submitting}
        >
          {submitting ? (
            <span className="signin__spinner" />
          ) : (
            <>
              Sign in <ArrowRight size={18} />
            </>
          )}
        </button>
        <div className="signin__biometric">
          <div className="signin__fp">
            <Fingerprint size={13} />
          </div>
          <span>Or use Face ID</span>
        </div>
      </div>

      <div className="signin__footer">v1.0 · J McCann &amp; Co Ltd</div>
    </div>
  );
}
