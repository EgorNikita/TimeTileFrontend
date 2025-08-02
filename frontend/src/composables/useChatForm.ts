import { ref, computed } from "vue";
import { Message } from "postcss";
import { User } from "@/services/userApi";

export interface EnrichedFile {
  file: File;
  guid: string;
}

export interface EnrichedMessage extends Message {
  user: User;
  files: EnrichedFile[];
}

export function useChatForm(
  courseId: number,
  messages: () => EnrichedMessage[],
) {
  const signalR = null; //useSignalRStore();

  // Form state
  const isOpen = ref(false);
  const isEditMode = ref(false);
  const content = ref("");
  const selectedFiles = ref<EnrichedFile[]>([]);
  const messageToEditId = ref<number | null>(null);
  const addedFilesCounter = ref(0);
  const isSubmitting = ref(false);

  const isEmpty = computed(
    () => !content.value.trim() && selectedFiles.value.length === 0,
  );

  // === Mutations ===
  // const { mutate: createMessage } = useCreateMessage();
  // const { mutate: updateMessage } = useUpdateMessage();

  // === File Handling ===
  const handleFilesUpdate = (updatedFiles: any[]) => {
    if (!isEditMode.value) return;
    selectedFiles.value = updatedFiles.map((file) => ({
      file: file.file,
      guid: file.isNew ? (++addedFilesCounter.value).toString() : file.guid!,
    }));
  };

  const calculateFileChanges = () => {
    const msg = messages().find((m) => m.id === messageToEditId.value);
    if (!msg) return { addedFiles: [], deletedGuids: [] };

    const originalGuids = msg.files?.map((f) => f.guid) ?? [];
    const currentGuids = selectedFiles.value.map((f) => f.guid);

    const addedFiles = selectedFiles.value
      .filter((f) => !originalGuids.includes(f.guid))
      .map((f) => f.file);

    const deletedGuids = originalGuids.filter((g) => !currentGuids.includes(g));

    return { addedFiles, deletedGuids };
  };

  // === Form Actions ===
  const openForm = () => {
    isOpen.value = true;
    isEditMode.value = false;
  };

  const openEditForm = (message: EnrichedMessage) => {
    content.value = message.content ?? "";
    selectedFiles.value = message.files ?? [];
    messageToEditId.value = message.id;
    isOpen.value = true;
    isEditMode.value = true;
  };

  const closeForm = () => {
    content.value = "";
    selectedFiles.value = [];
    messageToEditId.value = null;
    isOpen.value = false;
  };

  const sendMessage = async () => {
    // const trimmed = content.value.trim();
    // if (selectedFiles.value.length > 0) {
    //   createMessage({
    //     courseId,
    //     content: trimmed,
    //     files: selectedFiles.value.map((f) => f.file),
    //   });
    // } else {
    //   await signalR.sendMessage(courseId, trimmed);
    // }
  };

  const editMessage = async () => {
    // const { addedFiles, deletedGuids } = calculateFileChanges();
    // const trimmed = content.value.trim();
    //
    // if (addedFiles.length === 0 && deletedGuids.length === 0) {
    //   await signalR.editMessage(messageToEditId.value!, trimmed);
    // } else {
    //   updateMessage({
    //     messageId: messageToEditId.value!,
    //     payload: {
    //       content: trimmed,
    //       filesToAdd: addedFiles,
    //       filesToRemove: deletedGuids,
    //     },
    //   });
    // }
  };

  const submitForm = async () => {
    if (isSubmitting.value || isEmpty.value) return;
    isSubmitting.value = true;

    try {
      if (isEditMode.value) {
        await editMessage();
      } else {
        await sendMessage();
      }
    } finally {
      isSubmitting.value = false;
      closeForm();
    }
  };

  return {
    // State
    isOpen,
    isEditMode,
    content,
    selectedFiles,
    isSubmitting,
    isEmpty,

    // Methods
    openForm,
    openEditForm,
    closeForm,
    submitForm,
    handleFilesUpdate,
  };
}
