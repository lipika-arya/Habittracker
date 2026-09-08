// Small, hand-drawn inline icon set — no icon library dependency. Each icon
// is a plain functional component that forwards className/props onto an
// <svg>, sized via CSS (width/height: 1em) so it scales with font-size.

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function FlameIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M12 2c1 3-3 4-3 8a3 3 0 0 0 6 0c0-1-.5-2-1-3 2 1 4 3.5 4 6.5A6 6 0 0 1 6 13.5C6 8 9 6 12 2Z" />
    </svg>
  );
}

export function TrophyIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5H5a3 3 0 0 0 3 3" />
      <path d="M16 5h3a3 3 0 0 1-3 3" />
      <path d="M10 15v2" />
      <path d="M14 15v2" />
      <path d="M8 21h8" />
      <path d="M9 21c0-2 1-3 3-3s3 1 3 3" />
    </svg>
  );
}

export function TargetIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.5" />
    </svg>
  );
}

export function WarningIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M12 3.5 21.5 20h-19L12 3.5Z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function PencilIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
      <path d="M13.5 8 16 10.5" />
    </svg>
  );
}

export function TrashIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M5 7h14" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M7 7l1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

export function CheckIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M5 12.5 9.5 17 19 7" />
    </svg>
  );
}

export function PlusIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function CloseIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export function CalendarIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="16" rx="3" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M3.5 10h17" />
    </svg>
  );
}

export function SunIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2.5" />
      <path d="M12 19.5V22" />
      <path d="M4.2 4.2l1.8 1.8" />
      <path d="M18 18l1.8 1.8" />
      <path d="M2 12h2.5" />
      <path d="M19.5 12H22" />
      <path d="M4.2 19.8l1.8-1.8" />
      <path d="M18 6l1.8-1.8" />
    </svg>
  );
}

export function MoonIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

export function BoltIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

export function GloveIcon(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M7 12V7a3 3 0 0 1 6 0v1a2.5 2.5 0 0 1 5 0v4.5a5.5 5.5 0 0 1-5.5 5.5H10a5 5 0 0 1-5-5v-1.5a1.5 1.5 0 0 1 3 0V12" />
      <path d="M6.5 18.5 5 21" />
    </svg>
  );
}
