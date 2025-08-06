export type FileType =
  | "document"
  | "image"
  | "video"
  | "audio"
  | "text"
  | "code"
  | "spreadsheet"
  | "presentation"
  | "archive";

export interface FileTypeInfo {
  type: FileType;
  label: string;
  canPreview: boolean;
}

interface FileMetadata {
  type: FileType;
  label?: string;
  preview?: boolean;
}

const FILE_METADATA: Record<string, FileMetadata> = {
  // Documents
  "application/pdf": { type: "document", label: "PDF", preview: true },
  "application/msword": { type: "document", label: "DOC" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    type: "document",
    label: "DOCX",
  },
  "application/rtf": { type: "document" },
  "application/vnd.oasis.opendocument.text": { type: "document" },

  // Spreadsheets
  "application/vnd.ms-excel": { type: "spreadsheet", label: "XLS" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    type: "spreadsheet",
    label: "XLSX",
  },
  "application/vnd.oasis.opendocument.spreadsheet": { type: "spreadsheet" },
  "text/csv": { type: "spreadsheet", label: "CSV", preview: true },

  // Presentations
  "application/vnd.ms-powerpoint": { type: "presentation", label: "PPT" },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    type: "presentation",
    label: "PPTX",
  },
  "application/vnd.oasis.opendocument.presentation": { type: "presentation" },

  // Archives
  "application/zip": { type: "archive", label: "ZIP" },
  "application/x-rar-compressed": { type: "archive", label: "RAR" },
  "application/x-7z-compressed": { type: "archive" },
  "application/x-tar": { type: "archive" },
  "application/gzip": { type: "archive" },

  // Code
  "application/javascript": { type: "code", label: "JS", preview: true },
  "application/json": { type: "code", label: "JSON", preview: true },
  "application/xml": { type: "code", label: "XML", preview: true },
  "text/html": { type: "code", label: "HTML", preview: true },
  "text/css": { type: "code", label: "CSS", preview: true },
  "text/javascript": { type: "code", label: "JS", preview: true },
  "text/x-python": { type: "code" },

  // Text
  "text/plain": { type: "text", label: "TXT", preview: true },
  "text/markdown": { type: "text", label: "MD", preview: true },
  "application/yaml": { type: "text", label: "YAML", preview: true },
  "text/yaml": { type: "text", label: "YAML", preview: true },
};

// Extension fallback
const EXTENSION_METADATA: Record<string, FileMetadata> = {
  // Images
  jpg: { type: "image", preview: true },
  jpeg: { type: "image", preview: true },
  png: { type: "image", preview: true },
  gif: { type: "image", preview: true },
  svg: { type: "image", preview: true },
  webp: { type: "image", preview: true },

  // Video
  mp4: { type: "video" },
  avi: { type: "video" },
  mkv: { type: "video" },
  mov: { type: "video" },
  webm: { type: "video" },

  // Audio
  mp3: { type: "audio" },
  wav: { type: "audio" },
  flac: { type: "audio" },
  aac: { type: "audio" },

  // Archives
  zip: { type: "archive" },
  rar: { type: "archive" },
  "7z": { type: "archive" },
  tar: { type: "archive" },
  gz: { type: "archive" },

  // Code
  js: { type: "code", label: "JS", preview: true },
  ts: { type: "code", label: "TS", preview: true },
  py: { type: "code", label: "PY", preview: true },
  java: { type: "code" },
  cpp: { type: "code" },
  c: { type: "code" },
  php: { type: "code" },
  rb: { type: "code" },
  go: { type: "code" },

  // Text
  txt: { type: "text", label: "TXT", preview: true },
  md: { type: "text", label: "MD", preview: true },
  yml: { type: "text", label: "YAML", preview: true },
  yaml: { type: "text", label: "YAML", preview: true },

  // Docs, spreadsheets, presentations
  doc: { type: "document" },
  docx: { type: "document" },
  pdf: { type: "document", label: "PDF", preview: true },
  xls: { type: "spreadsheet" },
  xlsx: { type: "spreadsheet" },
  csv: { type: "spreadsheet", preview: true },
  ppt: { type: "presentation" },
  pptx: { type: "presentation" },
};

export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

export function getFileInfo(file: File): FileTypeInfo {
  const mimeType = file.type.toLowerCase();
  const extension = getFileExtension(file.name);

  const meta = FILE_METADATA[mimeType] ||
    EXTENSION_METADATA[extension] || { type: "document" };

  return {
    type: meta.type,
    label:
      meta.label ||
      extension.toUpperCase() ||
      mimeType.split("/")[1]?.toUpperCase() ||
      "FILE",
    canPreview:
      meta.preview ??
      (mimeType.startsWith("image/") || mimeType.startsWith("text/")),
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/^"+|"+$/g, "")
    .replace(/^\s+|\s+$/g, "")
    .replace(/[<>:"/\\|?*]/g, "_")
    .replace(/\s+/g, "_");
}
