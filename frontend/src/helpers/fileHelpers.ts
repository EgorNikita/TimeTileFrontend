// Function to get file extension
const getFileExtension = (filename: string): string => {
    return filename.split(".").pop()?.toLowerCase() || "";
};

// Function to format file size
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Function to get file type based on MIME type
export const getFileType = (file: File): string => {
    const mimeType = file.type.toLowerCase();

    // Primary check using MIME type
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType.startsWith("text/")) return "text";

    // Specific MIME types
    const typeMap: Record<string, string> = {
        // Documents
        "application/pdf": "document",
        "application/msword": "document",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            "document",
        "application/rtf": "document",
        "application/vnd.oasis.opendocument.text": "document",

        // Spreadsheets
        "application/vnd.ms-excel": "spreadsheet",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            "spreadsheet",
        "application/vnd.oasis.opendocument.spreadsheet": "spreadsheet",
        "text/csv": "spreadsheet",

        // Presentations
        "application/vnd.ms-powerpoint": "presentation",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation":
            "presentation",
        "application/vnd.oasis.opendocument.presentation": "presentation",

        // Archives
        "application/zip": "archive",
        "application/x-rar-compressed": "archive",
        "application/x-7z-compressed": "archive",
        "application/x-tar": "archive",
        "application/gzip": "archive",

        // Code/Development
        "application/javascript": "code",
        "application/json": "code",
        "application/xml": "code",
        "text/html": "code",
        "text/css": "code",
        "text/javascript": "code",
        "application/x-python": "code",
        "text/x-python": "code",

        // Text
        "text/plain": "text",
        "text/markdown": "text",
        "application/yaml": "text",
        "text/yaml": "text",
    };

    // If MIME type matches, return the category
    if (typeMap[mimeType]) {
        return typeMap[mimeType];
    }

    // Fallback to extension-based detection if MIME type is generic or unknown
    if (mimeType === "application/octet-stream" || !mimeType) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "";
        const extMap: Record<string, string> = {
            doc: "document",
            docx: "document",
            pdf: "document",
            jpg: "image",
            jpeg: "image",
            png: "image",
            gif: "image",
            svg: "image",
            mp4: "video",
            avi: "video",
            mkv: "video",
            mov: "video",
            mp3: "audio",
            wav: "audio",
            flac: "audio",
            zip: "archive",
            rar: "archive",
            "7z": "archive",
            js: "code",
            ts: "code",
            py: "code",
            java: "code",
            cpp: "code",
            txt: "text",
            md: "text",
            xls: "spreadsheet",
            xlsx: "spreadsheet",
            ppt: "presentation",
            pptx: "presentation",
        };
        return extMap[ext] || "document";
    }

    return "document";
};

// Function to check if file can be previewed
export const canBePreviewed = (file: File): boolean => {
    const mimeType = file.type.toLowerCase();

    // Check MIME type first
    if (mimeType.startsWith("image/")) return true;
    if (mimeType.startsWith("text/")) return true;
    if (mimeType === "application/pdf") return true;
    if (mimeType === "application/json") return true;

    // Fallback to extension check for unknown MIME types
    if (!mimeType || mimeType === "application/octet-stream") {
        const ext = getFileExtension(file.name);
        const previewableExtensions = [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "svg",
            "webp",
            "pdf",
            "txt",
            "md",
            "json",
            "xml",
            "csv",
            "html",
            "css",
            "js",
        ];
        return previewableExtensions.includes(ext);
    }

    return false;
};

// Function to get file type label for display
export const getFileTypeLabel = (file: File): string => {
    const mimeType = file.type.toLowerCase();

    // Show specific MIME type labels for better user understanding
    const labelMap: Record<string, string> = {
        "application/pdf": "PDF",
        "application/msword": "DOC",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            "DOCX",
        "application/vnd.ms-excel": "XLS",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
        "application/vnd.ms-powerpoint": "PPT",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation":
            "PPTX",
        "application/zip": "ZIP",
        "application/x-rar-compressed": "RAR",
        "application/json": "JSON",
        "text/csv": "CSV",
        "text/plain": "TXT",
        "text/html": "HTML",
        "text/css": "CSS",
        "text/javascript": "JS",
        "application/javascript": "JS",
    };

    // If we have a specific label for this MIME type, use it
    if (labelMap[mimeType]) {
        return labelMap[mimeType];
    }

    // For generic MIME types, show the subtype
    if (mimeType.includes("/")) {
        const subtype = mimeType.split("/")[1].toUpperCase();
        return subtype;
    }

    // Fallback to file extension
    return getFileExtension(file.name).toUpperCase() || "FILE";
};

// Function to open/preview file
export const openFile = (file: File) => {
    const url = URL.createObjectURL(file);

    if (canBePreviewed(file)) {
        // For previewable files, open in a new tab
        window.open(url, "_blank");
    } else {
        // For non-previewable files, trigger download
        downloadFile(file);
    }

    // Clean up the URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// Function to download file
export const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};