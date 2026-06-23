// Small set of hand-drawn line icons (thin stroke, currentColor) so the UI
// doesn't depend on an icon library - the old repo imported lucide-react
// without ever declaring it in package.json, which breaks a fresh install.

const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function UploadIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 16V4M12 4l-4.5 4.5M12 4l4.5 4.5" />
      <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
    </svg>
  );
}

export function DocumentIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4" />
      <path d="M9 13h6M9 16.5h6" />
    </svg>
  );
}

export function AlertIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4 3 19h18L12 4Z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="16.5" r="0.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SpinnerIcon(props) {
  return (
    <svg {...base} viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="9" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </svg>
  );
}

export function ClockIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function TrendUpIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 16 10 10l3.5 3.5L20 7" />
      <path d="M14.5 7H20v5.5" />
    </svg>
  );
}

export function TrendDownIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8l6 6 3.5-3.5L20 17" />
      <path d="M14.5 17H20v-5.5" />
    </svg>
  );
}

export function TrendFlatIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h16" />
      <path d="M17 9l3 3-3 3" />
    </svg>
  );
}

export function GaugeIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 17 8 8l3.5 5.5L14.5 8 21 17" />
      <path d="M3 17h18" />
    </svg>
  );
}

export function BoltIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" />
    </svg>
  );
}

export function StampCheckIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9" />
    </svg>
  );
}