import { ref, computed } from "vue";
import { sanitizeFilename } from "@/utils/fileUtils";

export interface FileOperationOptions {
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

/**
 * Check if file can be previewed in the browser
 */
function canPreviewFile(file: File) {
  return file.type.startsWith("image/") || file.type === "application/pdf";
}

export function useFileOperations(options: FileOperationOptions = {}) {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Centralized error handling
   */
  function handleError(err: unknown, fallbackMessage: string) {
    const errorMessage = err instanceof Error ? err.message : fallbackMessage;
    error.value = errorMessage;
    options.onError?.(errorMessage);
  }

  /**
   * Helper to safely create an object URL for a file
   */
  function withFileUrl(file: File, callback: (url: string) => void) {
    const url = URL.createObjectURL(file);
    try {
      callback(url);
    } finally {
      // Revoke after a short delay to let the browser use the URL
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }

  /**
   * Trigger a file download
   */
  function triggerDownload(file: File, url: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = sanitizeFilename(file.name);
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Open file for preview or download
   */
  const openFile = (file: File) => {
    try {
      withFileUrl(file, (url) => {
        if (canPreviewFile(file)) {
          window.open(url, "_blank");
          options.onSuccess?.(`File "${file.name}" opened for preview`);
        } else {
          triggerDownload(file, url);
          options.onSuccess?.(`File "${file.name}" downloaded successfully`);
        }
      });
    } catch (err) {
      handleError(err, "Failed to open file");
    }
  };

  /**
   * Download file
   */
  const downloadFile = (file: File) => {
    try {
      withFileUrl(file, (url) => {
        triggerDownload(file, url);
        options.onSuccess?.(`File "${file.name}" downloaded successfully`);
      });
    } catch (err) {
      handleError(err, "Failed to download file");
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    error.value = null;
  };

  return {
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    openFile,
    downloadFile,
    clearError,
  };
}
