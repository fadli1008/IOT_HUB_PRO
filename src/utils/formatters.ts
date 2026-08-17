export function formatTelemetryValue(
  value: any,
  formula?: string,
  decimalPlaces: number = 1
): string {
  if (value === undefined || value === null) return '--';

  let num = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(num)) return String(value);

  if (formula && formula.trim()) {
    try {
      // Safe evaluation of simple math formula e.g. "value * 1.8 + 32"
      const sanitized = formula.replace(/value/g, String(num));
      // Only allow digits, math operators, parens, decimal
      if (/^[0-9+\-*/().\s]+$/.test(sanitized)) {
        num = Function(`'use strict'; return (${sanitized})`)();
      }
    } catch {
      // Fallback if formula error
    }
  }

  return num.toFixed(decimalPlaces);
}

export function formatTimeAgo(timestampStrOrMs: string | number): string {
  const time = typeof timestampStrOrMs === 'string' ? new Date(timestampStrOrMs).getTime() : timestampStrOrMs;
  const now = Date.now();
  const diffSec = Math.floor((now - time) / 1000);

  if (diffSec < 5) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

export function generateToken(prefix: string = 'iothub'): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let rand = '';
  for (let i = 0; i < 24; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}_tok_${rand}`;
}
