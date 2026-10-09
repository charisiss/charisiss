type IconProps = { className?: string };

export function GlobeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.5 12h17M12 3.5c2.5 2.8 3.8 5.7 3.8 8.5S14.5 17.7 12 20.5c-2.5-2.8-3.8-5.7-3.8-8.5S9.5 6.3 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.94 8.5H3.75V20.25h3.19V8.5ZM5.35 3.75a1.85 1.85 0 1 0 0 3.7 1.85 1.85 0 0 0 0-3.7ZM20.25 20.25h-3.18v-6.16c0-1.47-.03-3.36-2.05-3.36-2.05 0-2.36 1.6-2.36 3.25v6.27H9.48V8.5h3.05v1.6h.04c.42-.8 1.46-1.65 3-1.65 3.21 0 3.8 2.11 3.8 4.86v6.94Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14.5 20.25V12.9h2.45l.37-2.85H14.5V8.25c0-.82.23-1.38 1.42-1.38h1.52V4.3c-.26-.03-1.16-.11-2.2-.11-2.18 0-3.67 1.33-3.67 3.77v2.1H9v2.85h2.57v7.34h2.93Z" />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 13h2.5M13.5 13H16M8 16.5h2.5M13.5 16.5H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
