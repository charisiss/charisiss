import type { ReactNode } from "react";
import { DangerButton, SubmitButton } from "./pending-button";

export { DangerButton, SubmitButton };

const controlClass =
  "w-full rounded-sm border border-line bg-background px-3 py-2.5 text-base text-foreground outline-none focus:border-accent sm:py-2 sm:text-sm";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8 sm:gap-4">
      <div className="min-w-0">
        <p className="eyebrow mb-2">Management</p>
        <h1 className="font-display text-2xl tracking-wide text-foreground sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function Panel({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`min-w-0 border border-line bg-surface/60 p-3.5 sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}

export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  step,
  children,
}: {
  label: string;
  name?: string;
  type?: string;
  defaultValue?: string | number | null;
  required?: boolean;
  step?: string;
  children?: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-muted">{label}</span>
      {children ?? (
        <input
          name={name}
          type={type}
          required={required}
          step={step}
          defaultValue={defaultValue ?? undefined}
          className={controlClass}
        />
      )}
    </label>
  );
}

export function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <Field label={label}>
      <select name={name} defaultValue={defaultValue} className={controlClass}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-full overflow-x-auto overscroll-x-contain">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">{children}</table>
    </div>
  );
}

export function ExpiryBadge({ days }: { days: number | null }) {
  if (days === null) return <span className="text-muted">—</span>;
  const tone =
    days <= 30 ? "text-red-300" : days <= 60 ? "text-amber-300" : "text-emerald-300";
  return (
    <span className={tone}>
      {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d`}
    </span>
  );
}
