/**
 * DialogAtoms — primitives for the modal dialog surface. Currently exposes
 * only DialogFieldRow (labeled input pair). DialogSection and
 * DialogFooterRow are intentionally absent until a second dialog exists
 * to justify the abstraction.
 */

import * as React from 'react';
import { Input } from '../ui/input';

export function DialogFieldRow({
  label,
  placeholder,
  value,
  onChange,
  className,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (next: string) => void;
  className?: string;
}) {
  return (
    <div className={className ?? 'space-y-1'}>
      <span className="text-[10px] uppercase font-bold text-muted-foreground ml-1">{label}</span>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-sm"
      />
    </div>
  );
}
