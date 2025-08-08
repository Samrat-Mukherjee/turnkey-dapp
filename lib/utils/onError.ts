// lib/utils/onError.ts

import { toast } from 'react-toastify';

export function onError(error: unknown, fallbackMessage = "Something went wrong") {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : fallbackMessage;

  toast.error(`❌ ${message}`);
}
