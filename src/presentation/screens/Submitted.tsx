import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobsStore } from '../../application/stores/jobsStore';
import { useSubmittedCost } from '../../application/usecases/useCurrentCost';
import { formatGBP, formatHours } from '../../domain/costEngine';
import { Check } from '../components/ui/Icons';
import './Submitted.css';

export function Submitted() {
  const navigate = useNavigate();
  const submitted = useJobsStore((s) => s.submittedDraft);
  const cost = useSubmittedCost();

  // Guard: no submission means we shouldn't be here
  useEffect(() => {
    if (!submitted) navigate('/home', { replace: true });
  }, [submitted, navigate]);

  if (!submitted || !cost) return null;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const timeStr = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const handleBack = () => {
    navigate('/home');
  };

  return (
    <div className="submitted">
      <div className="tick-wrap">
        <Check size={48} color="#0E2A47" stroke={3} />
      </div>

      <h1 className="submitted__h1">
        Record <em>submitted</em>
      </h1>
      <div className="submitted__lede">
        Your job has been logged and sent to the QS team for review.
      </div>

      <div className="receipt">
        <div className="receipt__h">
          <div>
            <div className="receipt__id">RECEIPT</div>
            <div className="receipt__ref">{submitted.jobId}</div>
          </div>
          <div className="receipt__when">
            {dateStr}
            <br />
            {timeStr} BST
          </div>
        </div>

        <div className="receipt__line">
          <span>Time on site</span>
          <span className="receipt__line-v">{formatHours(cost.hoursOnSite)}</span>
        </div>
        <div className="receipt__line">
          <span>Plant items</span>
          <span className="receipt__line-v">{submitted.plant.length}</span>
        </div>
        <div className="receipt__line">
          <span>Materials</span>
          <span className="receipt__line-v">
            {submitted.materials.length}{' '}
            {submitted.materials.length === 1 ? 'line' : 'lines'}
          </span>
        </div>
        <div className="receipt__line">
          <span>Vehicles</span>
          <span className="receipt__line-v">{submitted.vehicles.length}</span>
        </div>
        <div className="receipt__line">
          <span>Rate card</span>
          <span className="receipt__line-v">v.{cost.rateCardVersion}</span>
        </div>

        <div className="receipt__total">
          <span className="receipt__total-l">Total cost</span>
          <span className="receipt__total-v">{formatGBP(cost.total)}</span>
        </div>
      </div>

      <div className="send-state">
        <span className="send-state__dot" />
        Synced — visible to QS
      </div>

      <div className="submitted__actions">
        <button className="submitted__primary" onClick={handleBack}>
          Back to today's jobs
        </button>
        <button className="submitted__secondary">View receipt</button>
      </div>
    </div>
  );
}
