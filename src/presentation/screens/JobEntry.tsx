import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalogStore } from '../../application/stores/catalogStore';
import { useJobsStore } from '../../application/stores/jobsStore';
import { useCurrentCost } from '../../application/usecases/useCurrentCost';
import { formatGBP, formatHours } from '../../domain/costEngine';
import {
  ArrowLeft,
  Check,
  Minus,
  Plus,
  Scan,
} from '../components/ui/Icons';
import './JobEntry.css';

export function JobEntry() {
  const navigate = useNavigate();

  const { plant, materials, vehicles, load, loaded } = useCatalogStore();
  const {
    draft,
    setDeparture,
    togglePlant,
    setPlantDuration,
    addMaterial,
    removeMaterial,
    setMaterialQty,
    toggleVehicle,
    setNotes,
    submitDraft,
  } = useJobsStore();

  const cost = useCurrentCost();

  useEffect(() => {
    if (!loaded) void load();
  }, [load, loaded]);

  // If no draft, send user back to home
  useEffect(() => {
    if (!draft) navigate('/home', { replace: true });
  }, [draft, navigate]);

  // Compute progress percentage from how much of the form is filled
  const progress = useMemo(() => {
    if (!draft) return 0;
    let n = 0;
    if (draft.arrivalTime) n++;
    if (draft.departureTime) n++;
    if (draft.plant.length > 0) n++;
    if (draft.materials.length > 0) n++;
    if (draft.vehicles.length > 0) n++;
    return Math.round((n / 5) * 100);
  }, [draft]);

  if (!draft) return null;

  const canSubmit = !!draft.departureTime && cost && cost.total > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    submitDraft();
    navigate('/submitted');
  };

  const handleLogDeparture = () => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    // Mock: ensure departure is at least 1h42m after arrival for a nice demo number
    if (!draft.departureTime) {
      setDeparture('09:56');
    } else {
      setDeparture(time);
    }
  };

  return (
    <div className="entry">
      <div className="entry__top">
        <button
          className="entry__back"
          onClick={() => navigate('/home')}
          aria-label="Back"
        >
          <ArrowLeft size={16} stroke={2.5} />
        </button>
        <div className="entry__title">Job Entry</div>
        <button className="entry__save">Save draft</button>
      </div>

      <div className="entry__progress">
        <Segment filled={progress >= 20} now={progress < 20} />
        <Segment filled={progress >= 40} now={progress >= 20 && progress < 40} />
        <Segment filled={progress >= 60} now={progress >= 40 && progress < 60} />
        <Segment filled={progress >= 80} now={progress >= 60 && progress < 80} />
        <div className="entry__progress-pct">{progress}%</div>
      </div>

      <div className="entry__banner">
        <div>
          <div className="entry__banner-lbl">Job Reference</div>
          <div className="entry__banner-ref">{draft.jobId}</div>
        </div>
        <div className="entry__banner-ic">
          <Scan size={14} />
        </div>
      </div>

      <div className="entry__scroll">
        {/* TIME ON SITE — FR-OP-03 / FR-OP-04 */}
        <div className="entry__group">
          <div className="entry__label">
            <span>Time on site</span>
            <span className="entry__label-req">FR-OP-03 · FR-OP-04</span>
          </div>
          <div className="time-row">
            <div className="time-pill">
              <div className="time-pill__ttl">Arrived</div>
              <div className="time-pill__val">{draft.arrivalTime ?? '—'}</div>
              <div className="time-pill__day">Today</div>
            </div>
            <button
              className={
                'time-pill' + (!draft.departureTime ? ' time-pill--amber' : '')
              }
              onClick={handleLogDeparture}
            >
              <div className="time-pill__ttl">Departed</div>
              <div className="time-pill__val">{draft.departureTime ?? '— : —'}</div>
              <div className="time-pill__day">
                {draft.departureTime ? 'Today' : 'Tap to log'}
              </div>
            </button>
          </div>
        </div>

        {/* PLANT & TOOLS — FR-OP-05 */}
        <div className="entry__group">
          <div className="entry__label">
            <span>Plant &amp; tools</span>
            <span className="entry__label-req">FR-OP-05</span>
          </div>
          {plant.map((item) => {
            const selected = draft.plant.find((p) => p.plantId === item.id);
            return (
              <div
                key={item.id}
                className={
                  'selector-card' + (selected ? ' selector-card--selected' : '')
                }
                onClick={() => !selected && togglePlant(item.id, 1)}
                role="button"
              >
                <div>
                  <div className="selector-card__nm">{item.name}</div>
                  <div className="selector-card__rate">
                    {formatGBP(item.ratePerHour)}/hr
                  </div>
                </div>
                {selected ? (
                  <div className="selector-card__right">
                    <Stepper
                      value={selected.durationHours}
                      onDec={() =>
                        setPlantDuration(item.id, selected.durationHours - 0.5)
                      }
                      onInc={() =>
                        setPlantDuration(item.id, selected.durationHours + 0.5)
                      }
                      formatValue={(v) => `${v}h`}
                      minValue={0.5}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlant(item.id);
                      }}
                      style={{
                        color: 'var(--ink-3)',
                        fontSize: 13,
                        padding: 4,
                        marginLeft: 4,
                      }}
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div
                    className="add-row__pl"
                    style={{
                      width: 28,
                      height: 28,
                      background: 'var(--surface)',
                      color: 'var(--navy)',
                    }}
                  >
                    <Plus size={14} stroke={2.5} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* MATERIALS — FR-OP-06 */}
        <div className="entry__group">
          <div className="entry__label">
            <span>Materials used</span>
            <span className="entry__label-req">FR-OP-06</span>
          </div>
          {materials.map((item) => {
            const selected = draft.materials.find(
              (m) => m.materialId === item.id,
            );
            return (
              <div
                key={item.id}
                className={
                  'selector-card' + (selected ? ' selector-card--selected' : '')
                }
                onClick={() => !selected && addMaterial(item.id)}
                role="button"
              >
                <div>
                  <div className="selector-card__nm">{item.name}</div>
                  <div className="selector-card__rate">
                    {formatGBP(item.unitCost)} / {item.unit}
                  </div>
                </div>
                {selected ? (
                  <div className="selector-card__right">
                    <Stepper
                      value={selected.quantity}
                      onDec={() =>
                        setMaterialQty(item.id, selected.quantity - 1)
                      }
                      onInc={() =>
                        setMaterialQty(item.id, selected.quantity + 1)
                      }
                      formatValue={(v) => `×${v}`}
                      minValue={1}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMaterial(item.id);
                      }}
                      style={{
                        color: 'var(--ink-3)',
                        fontSize: 13,
                        padding: 4,
                        marginLeft: 4,
                      }}
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div
                    className="add-row__pl"
                    style={{
                      width: 28,
                      height: 28,
                      background: 'var(--surface)',
                      color: 'var(--navy)',
                    }}
                  >
                    <Plus size={14} stroke={2.5} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* VEHICLES — FR-OP-07 */}
        <div className="entry__group">
          <div className="entry__label">
            <span>Vehicles on-site</span>
            <span className="entry__label-req">FR-OP-07</span>
          </div>
          {vehicles.map((item) => {
            const selected = draft.vehicles.find(
              (v) => v.vehicleId === item.id,
            );
            return (
              <button
                key={item.id}
                className={
                  'selector-card' + (selected ? ' selector-card--selected' : '')
                }
                onClick={() => toggleVehicle(item.id, draft.arrivalTime)}
              >
                <div>
                  <div className="selector-card__nm">{item.name}</div>
                  <div className="selector-card__rate">
                    {formatGBP(item.dailyRate)}/day
                  </div>
                </div>
                <div
                  className="add-row__pl"
                  style={{
                    width: 28,
                    height: 28,
                    background: selected ? 'var(--navy)' : 'var(--surface)',
                    color: selected ? '#fff' : 'var(--navy)',
                  }}
                >
                  {selected ? <Check size={14} stroke={3} /> : <Plus size={14} stroke={2.5} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* NOTES — FR-OP-08 */}
        <div className="entry__group">
          <div className="entry__label">
            <span>Notes</span>
            <span className="entry__label-req">FR-OP-08</span>
          </div>
          <textarea
            className="notes-input"
            placeholder="Anything the office should know…"
            value={draft.notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={2000}
          />
        </div>

        <div style={{ height: 12 }} />
      </div>

      <div className="cost-sum">
        <div className="cost-sum__row">
          <span className="cost-sum__lab">
            Labour {cost ? `· ${formatHours(cost.hoursOnSite)}` : ''}
          </span>
          <span className="cost-sum__val">
            {formatGBP(cost?.labour ?? 0)}
          </span>
        </div>
        <div className="cost-sum__row">
          <span className="cost-sum__lab">Plant + materials + vehicle</span>
          <span className="cost-sum__val">
            {formatGBP((cost?.plant ?? 0) + (cost?.materials ?? 0) + (cost?.vehicle ?? 0))}
          </span>
        </div>
        <div className="cost-sum__total">
          <span className="cost-sum__total-lab">Estimated total</span>
          <span className="cost-sum__total-val">
            {formatGBP(cost?.total ?? 0)}
          </span>
        </div>
        <button
          className="cost-sum__submit"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          <Check size={16} stroke={2.5} />
          {canSubmit ? 'Submit job record' : 'Log departure time to submit'}
        </button>
      </div>
    </div>
  );
}

function Segment({ filled, now }: { filled: boolean; now: boolean }) {
  return (
    <div
      className={
        'entry__progress-seg' +
        (filled ? ' entry__progress-seg--done' : '') +
        (now ? ' entry__progress-seg--now' : '')
      }
    />
  );
}

interface StepperProps {
  value: number;
  onDec: () => void;
  onInc: () => void;
  formatValue: (v: number) => string;
  minValue: number;
}

function Stepper({ value, onDec, onInc, formatValue, minValue }: StepperProps) {
  return (
    <div className="qty-stepper">
      <button
        className="qty-stepper__b"
        onClick={(e) => {
          e.stopPropagation();
          onDec();
        }}
        disabled={value <= minValue}
        aria-label="Decrease"
      >
        <Minus size={12} />
      </button>
      <div className="qty-stepper__v">{formatValue(value)}</div>
      <button
        className="qty-stepper__b"
        onClick={(e) => {
          e.stopPropagation();
          onInc();
        }}
        aria-label="Increase"
      >
        <Plus size={12} />
      </button>
    </div>
  );
}
