interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 min-h-11 py-2 text-left"
    >
      <span>
        <span className="block font-semibold text-text">{label}</span>
        {description && <span className="block text-sm text-text-muted">{description}</span>}
      </span>
      <span
        className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors
          ${checked ? 'bg-primary' : 'bg-border'}`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow
            ${checked ? 'translate-x-7' : 'translate-x-1'}`}
        />
      </span>
    </button>
  );
}
