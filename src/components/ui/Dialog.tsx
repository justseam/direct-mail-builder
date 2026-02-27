import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Dialog({ open, onClose, title, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);

  if (!open) return null;

  return createPortal(
    <dialog
      ref={ref}
      className="m-auto rounded-[12px] border border-border bg-white p-0 shadow-xl backdrop:bg-black/40 max-w-lg w-full"
      onClose={onClose}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="text-title-md font-medium text-text-primary">{title}</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full cursor-pointer">
          <X className="w-5 h-5 text-text-secondary" />
        </button>
      </div>
      <div className="px-6 py-4">{children}</div>
    </dialog>,
    document.body,
  );
}
