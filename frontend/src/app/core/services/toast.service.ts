import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSignal = signal<Toast[]>([]);
  private nextId = 0;

  // Expose toasts as a read-only signal
  toasts = this.toastsSignal.asReadonly();

  success(message: string, duration = 4000) {
    this.show('success', message, duration);
  }

  error(message: string, duration = 5000) {
    this.show('error', message, duration);
  }

  warning(message: string, duration = 4000) {
    this.show('warning', message, duration);
  }

  info(message: string, duration = 4000) {
    this.show('info', message, duration);
  }

  private show(type: 'success' | 'error' | 'warning' | 'info', message: string, duration: number) {
    if (!message || message.trim() === '') return;

    // Avoid duplicate identical messages currently visible in the queue
    const currentToasts = this.toastsSignal();
    const isDuplicate = currentToasts.some(
      t => t.type === type && t.message.toLowerCase() === message.toLowerCase()
    );
    if (isDuplicate) {
      return;
    }

    const id = this.nextId++;
    const newToast: Toast = { id, type, message, duration };

    this.toastsSignal.update(toasts => [...toasts, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
  }

  dismiss(id: number) {
    this.toastsSignal.update(toasts => toasts.filter(t => t.id !== id));
  }
}
