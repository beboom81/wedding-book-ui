import { useState } from 'react';
import { copyText } from '../../lib/util';

export default function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    const ok = await copyText(value);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <button
      className="btn btn-outline-auto btn-sm shadow-sm rounded-4 py-0"
      style={{ fontSize: '0.75rem' }}
      onClick={onClick}
      type="button"
    >
      <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
    </button>
  );
}
