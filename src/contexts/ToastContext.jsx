import { createContext, useContext, useState, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import PropTypes from 'prop-types';

const ToastContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    iconColor: 'text-success'
  },
  error: {
    icon: AlertCircle,
    iconColor: 'text-danger'
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-ink'
  },
  info: {
    icon: Info,
    iconColor: 'text-ink-2'
  }
};

const Toast = ({ toast, onClose }) => {
  const { icon: Icon, iconColor } = TOAST_TYPES[toast.type] || TOAST_TYPES.info;

  return (
    <Motion.div
      role={toast.type === 'error' ? 'alert' : 'status'}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="mb-2 flex w-full max-w-md items-start gap-3 rounded-lg border border-line bg-surface p-4 text-ink shadow-md"
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`} strokeWidth={1.75} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h4 className="mb-1 font-semibold">{toast.title}</h4>
        )}
        <p className="text-sm text-ink-2">{toast.message}</p>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        type="button"
        className="-m-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-2 hover:bg-surface-sunk"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </Motion.div>
  );
};

Toast.propTypes = {
  toast: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
    title: PropTypes.string,
    message: PropTypes.string.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message, title) => {
    return addToast({ type: 'success', message, title });
  }, [addToast]);

  const error = useCallback((message, title) => {
    return addToast({ type: 'error', message, title });
  }, [addToast]);

  const warning = useCallback((message, title) => {
    return addToast({ type: 'warning', message, title });
  }, [addToast]);

  const info = useCallback((message, title) => {
    return addToast({ type: 'info', message, title });
  }, [addToast]);

  const value = {
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <AnimatePresence>
            {toasts.map(toast => (
              <Toast key={toast.id} toast={toast} onClose={removeToast} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ToastContext;

