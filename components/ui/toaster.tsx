'use client';

import { AnimatePresence } from 'motion/react';
import { Toast } from './toast';
import { ToastContext, useToastState } from '@/hooks/use-toast';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastState = useToastState();

  return (
    <ToastContext.Provider value={toastState}>
      {children}
      <Toaster toasts={toastState.toasts} dismiss={toastState.dismiss} />
    </ToastContext.Provider>
  );
}

interface ToasterProps {
  toasts: ReturnType<typeof useToastState>['toasts'];
  dismiss: ReturnType<typeof useToastState>['dismiss'];
}

function Toaster({ toasts, dismiss }: ToasterProps) {
  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex max-h-screen w-full max-w-sm flex-col-reverse gap-2"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            variant={toast.variant}
            onDismiss={dismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
