'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { Toast as ToastType } from '@/hooks/use-toast';

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden rounded-lg border p-4 pr-10 shadow-lg',
  {
    variants: {
      variant: {
        default: 'border-border bg-background text-foreground',
        success:
          'border-green-500/30 bg-green-50 text-green-900 dark:bg-green-950/50 dark:text-green-100 dark:border-green-500/20',
        destructive:
          'border-destructive/30 bg-red-50 text-red-900 dark:bg-red-950/50 dark:text-red-100 dark:border-destructive/20',
        info: 'border-blue-500/30 bg-blue-50 text-blue-900 dark:bg-blue-950/50 dark:text-blue-100 dark:border-blue-500/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const iconMap = {
  default: null,
  success: CheckCircle2,
  destructive: AlertCircle,
  info: Info,
};

interface ToastProps extends VariantProps<typeof toastVariants> {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss, variant }: ToastProps) {
  const Icon = iconMap[variant ?? 'default'];
  const iconColorClass = {
    default: '',
    success: 'text-green-600 dark:text-green-400',
    destructive: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(toastVariants({ variant }))}
    >
      {Icon && <Icon className={cn('size-5 shrink-0', iconColorClass[variant ?? 'default'])} />}
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{toast.title}</p>
        {toast.description && (
          <p className="text-sm opacity-80">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="absolute right-3 top-3 rounded-md p-1 opacity-50 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Dismiss notification"
      >
        <X className="size-4" />
      </button>
    </motion.div>
  );
}
