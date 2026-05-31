import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../application/stores/authStore';
import { useJobsStore } from '../../application/stores/jobsStore';
import { formatHours } from '../../domain/costEngine';
import type { Job } from '../../domain/entities';
import { History, Home as HomeIcon, Note, Plus, Scan, User } from '../components/ui/Icons';
import './Home.css';

type Filter = 'all' | 'active' | 'pending';

export function Home() {
  const navigate = useNavigate();
  const operative = useAuthStore((s) => s.operative);
  const { jobs, load, loaded, startDraft } = useJobsStore();
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    if (!loaded) void load();
  }, [load, loaded]);

  const today = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }, []);

  const visibleJobs = useMemo(() => {
    if (filter === 'active') return jobs.filter((j) => j.status === 'live');
    if (filter === 'pending') return jobs.filter((j) => j.status === 'queued');
    return jobs;
  }, [jobs, filter]);

  const handleOpenJob = (job: Job) => {
    if (job.status === 'done') return;
    const arrival = job.arrivedAt ?? new Date().toTimeString().slice(0, 5);
    startDraft(job.id, arrival);
    navigate('/entry');
  };

  return (
    <div className="home">
      <div className="home__scroll">
        <div className="home__top">
          <div>
            <div className="home__hello">{today}</div>
            <div className="home__name">
              Morning, {operative?.fullName?.split(' ')[0] ?? 'there'}.
            </div>
          </div>
          <div className="home__avatar">{operative?.initials ?? '–'}</div>
        </div>

        <div className="scan-card">
          <div className="scan-card__lbl">Quick start</div>
          <div className="scan-card__title">Scan a job reference</div>
          <button
            className="scan-card__btn"
            onClick={() => jobs[0] && handleOpenJob(jobs[0])}
          >
            <Scan size={16} color="var(--navy)" stroke={2} />
            Open scanner
          </button>
        </div>

        <div className="section-h">
          <div className="section-h__t">Assigned today</div>
          <div className="section-h__more">
            {visibleJobs.length} of {jobs.length}
          </div>
        </div>

        <div className="chips">
          <button
            className={'chip' + (filter === 'all' ? ' chip--active' : '')}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={'chip' + (filter === 'active' ? ' chip--active' : '')}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={'chip' + (filter === 'pending' ? ' chip--active' : '')}
            onClick={() => setFilter('pending')}
          >
            Pending sync
          </button>
        </div>

        {visibleJobs.map((job) => (
          <button
            key={job.id}
            className={
              'job-card' + (job.status === 'done' ? ' job-card--muted' : '')
            }
            onClick={() => handleOpenJob(job)}
          >
            <div className="job-card__head">
              <div className="job-card__ref">{job.id}</div>
              <StatusBadge status={job.status} />
            </div>
            <div className="job-card__title">{job.title}</div>
            <div className="job-card__loc">
              <span className="job-card__pin-dot" />
              {job.road}, {job.location}
            </div>
            {(job.arrivedAt || job.etaTime || job.vehiclesCount) && (
              <div className="job-card__meta">
                {job.arrivedAt && (
                  <span>
                    In · <b>{job.arrivedAt}</b>
                  </span>
                )}
                {job.etaTime && (
                  <span>
                    ETA · <b>{job.etaTime}</b>
                  </span>
                )}
                {job.vehiclesCount && (
                  <>
                    <span>•</span>
                    <span>
                      {job.vehiclesCount}{' '}
                      {job.vehiclesCount === 1 ? 'vehicle' : 'vehicles'}
                    </span>
                  </>
                )}
                {job.durationMins && (
                  <>
                    <span>•</span>
                    <span>{formatHours(job.durationMins / 60)}</span>
                  </>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      <button
        className="fab"
        onClick={() => jobs[0] && handleOpenJob(jobs[0])}
        aria-label="New job"
      >
        <Plus size={22} stroke={2.5} />
      </button>

      <div className="tabbar">
        <button className="tab tab--active">
          <HomeIcon />
          <span>Jobs</span>
        </button>
        <button className="tab">
          <History />
          <span>History</span>
        </button>
        <button className="tab">
          <Note />
          <span>Notes</span>
        </button>
        <button className="tab">
          <User />
          <span>Account</span>
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Job['status'] }) {
  if (status === 'live')
    return <div className="job-card__status job-card__status--live">● ON SITE</div>;
  if (status === 'queued')
    return <div className="job-card__status job-card__status--queue">⟳ QUEUED</div>;
  if (status === 'done')
    return <div className="job-card__status job-card__status--done">DONE</div>;
  return null;
}
