import { toast, ToastOptions } from 'react-toastify';

export const showSuccessToast = (message: string, options?: ToastOptions) => {
  toast.success(message, options);
};

export const showErrorToast = (message: string, options?: ToastOptions) => {
  toast.error(message, options);
};

export const showInfoToast = (message: string, options?: ToastOptions) => {
  toast.info(message, options);
};

export const showToast = (
  type: 'success' | 'error' | 'info',
  message: string,
  options?: ToastOptions
) => {
  switch (type) {
    case 'success':
      showSuccessToast(message, options);
      break;
    case 'error':
      showErrorToast(message, options);
      break;
    case 'info':
      showInfoToast(message, options);
      break;
    default:
      toast(message, options);
  }
};
