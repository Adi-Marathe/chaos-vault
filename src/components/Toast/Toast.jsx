import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Toast.css';

/**
 * Toast notification system.
 * Use the exported `useToast` hook for a simple imperative API.
 */

let toastId = 0;

export function ToastContainer({ toasts = [], onDismiss }) {
  return (
    <div className="toast-container" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className={`toast toast--${t.type || 'info'}`}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <span className="toast__text">{t.message}</span>
            <button className="toast__close" onClick={() => onDismiss(t.id)} aria-label="Dismiss">
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function useToast(duration = 3000) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message, type = 'info') => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), duration);
      return id;
    },
    [duration, dismiss],
  );

  return { toasts, show, dismiss };
}
