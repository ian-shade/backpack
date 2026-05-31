import { type ReactNode } from 'react';
import './DeviceFrame.css';

interface DeviceFrameProps {
  children: ReactNode;
  /** When true, the status bar text is white (for dark-header screens like login) */
  inverseStatusBar?: boolean;
  inverseHomeIndicator?: boolean;
}

export function DeviceFrame({
  children,
  inverseStatusBar = false,
  inverseHomeIndicator = false,
}: DeviceFrameProps) {
  return (
    <div className="stage">
      <div className="stage__brand">
        <div className="stage__brand-mark">B</div>
        <span>Backpack</span>
      </div>

      <div className="stage__meta">
        <div>J McCann &amp; Co Ltd</div>
        <div>
          <b>Prototype</b>
        </div>
        <div>v1.0</div>
      </div>

      <div className="device">
        <div className="device__screen">
          <StatusBar inverse={inverseStatusBar} />
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            {children}
          </div>
          <div
            className={
              'home-indicator' +
              (inverseHomeIndicator ? ' home-indicator--inverse' : '')
            }
          />
        </div>
      </div>
    </div>
  );
}

function StatusBar({ inverse }: { inverse: boolean }) {
  return (
    <div className={'statusbar' + (inverse ? ' statusbar--inverse' : '')}>
      <span>9:41</span>
      <div className="statusbar__notch" />
      <div className="statusbar__icons">
        <svg width="16" height="10" viewBox="0 0 16 10">
          <path
            d="M0 8h2v2H0zM4 6h2v4H4zM8 4h2v6H8zM12 2h2v8h-2z"
            fill="currentColor"
          />
        </svg>
        <svg width="14" height="10" viewBox="0 0 14 10">
          <path
            d="M7 1C4.5 1 2.5 2 1 3.5l1 1c1.3-1.3 3-2 5-2s3.7.7 5 2l1-1C11.5 2 9.5 1 7 1zM7 4c-1.5 0-3 .5-4 1.5l1 1c.7-.7 1.8-1.2 3-1.2s2.3.5 3 1.2l1-1C10 4.5 8.5 4 7 4zM7 7c-.7 0-1.3.2-1.7.5l1.7 1.7L8.7 7.5C8.3 7.2 7.7 7 7 7z"
            fill="currentColor"
          />
        </svg>
        <svg width="22" height="10" viewBox="0 0 22 10">
          <rect
            x="0.5"
            y="0.5"
            width="18"
            height="9"
            rx="2"
            fill="none"
            stroke="currentColor"
          />
          <rect x="2" y="2" width="14" height="6" rx="1" fill="currentColor" />
          <rect
            x="19.5"
            y="3"
            width="1.5"
            height="4"
            rx="0.5"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
}
