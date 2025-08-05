import { toast } from 'react-toastify';

export function onSuccess(message = "Action completed successfully") {
  toast.success(`✅ ${message}`);
}
