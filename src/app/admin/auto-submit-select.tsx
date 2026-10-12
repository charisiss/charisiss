"use client";

export function AutoSubmitSelect({
  name,
  defaultValue,
  options,
  className = "rounded-sm border border-line bg-transparent px-1.5 py-1 text-xs text-foreground outline-none focus:border-accent",
}: {
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className={className}
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
