import type { ReactNode } from "react";

function Box({
  className,
  label,
  children,
}: {
  className: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-r-md rounded-l-sm p-4 ${className}`}>
      <p className="mb-1 font-heading text-xs font-bold uppercase tracking-wide text-muted">
        {label}
      </p>
      <div className="text-[0.95rem] leading-relaxed">{children}</div>
    </div>
  );
}

export function Tip({ children, label = "Tip" }: { children: ReactNode; label?: string }) {
  return (
    <Box className="box-tip" label={label}>
      {children}
    </Box>
  );
}

export function Mistake({
  children,
  label = "Common mistake",
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <Box className="box-mistake" label={label}>
      {children}
    </Box>
  );
}

export function Example({
  children,
  label = "Example",
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <Box className="box-example" label={label}>
      {children}
    </Box>
  );
}

export function Vocab({ children, label = "Vocabulary" }: { children: ReactNode; label?: string }) {
  return (
    <Box className="box-vocab" label={label}>
      {children}
    </Box>
  );
}
