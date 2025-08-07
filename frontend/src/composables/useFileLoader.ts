import { reactive, watch, onMounted, toRefs, Ref } from "vue";
import { fileApi } from "@/services/fileApi";

export interface FileUrl {
  fileUrl: string;
}

export interface FileLoaderState {
  files: File[];
  loading: boolean;
  error: string | null;
}

export function useFileLoader(fileUrls: Ref<string[]> | string[]) {
  const state = reactive<FileLoaderState>({
    files: [],
    loading: false,
    error: null,
  });

  const fetchFiles = async () => {
    const urls = Array.isArray(fileUrls) ? fileUrls : fileUrls.value;

    if (urls.length === 0) {
      state.files = [];
      return;
    }

    state.loading = true;
    state.error = null;
    state.files = [];

    try {
      const filePromises = urls.map(async (fileUrl) => {
        return await fileApi.fetchFileByGuidAsFile(fileUrl);
      });

      state.files = await Promise.all(filePromises);
      console.log("Fetched files:", state.files);
    } catch (err) {
      state.error =
        err instanceof Error ? err.message : "Failed to fetch files";
      console.error("Error fetching files:", state.error);
    } finally {
      state.loading = false;
    }
  };

  const retry = async () => {
    await fetchFiles();
  };

  const clear = async () => {
    state.files = [];
    state.error = null;
    state.loading = false;
  };

  // Watch for changes in file URLs if it's a ref
  if (!Array.isArray(fileUrls)) {
    watch(
      fileUrls,
      async (newFileUrls) => {
        if (newFileUrls?.length > 0) {
          await fetchFiles();
        } else {
          await clear();
        }
      },
      { immediate: true },
    );
  }

  // Auto-fetch on mount if fileUrls is an array
  if (Array.isArray(fileUrls)) {
    onMounted(fetchFiles);
  }

  return {
    ...toRefs(state),
    fetchFiles,
    retry,
    clear,
  };
}
