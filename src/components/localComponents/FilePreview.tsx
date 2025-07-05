import { File } from "lucide-react";

type FilePreviewProps = {
  url: string;
};

export default function FilePreview({ url }: FilePreviewProps) {
  const downloadUrl = url.includes("?")
    ? url + "&response-content-disposition=attachment"
    : url + "?response-content-disposition=attachment";

  let ext = "";

  try {
    const match = url.match(/\/o\/(.+)\?/);
    if (match && match[1]) {
      const decoded = decodeURIComponent(match[1]);
      ext = decoded.split(".").pop()?.toLowerCase() || "";
    }
  } catch (error) {
    console.error("Failed to extract file extension:", error);
  }

  if (!ext) return null;

  const containerClass =
    "bg-card text-card-foreground flex flex-col gap-4 rounded-xl border shadow-sm h-64 w-64 items-center justify-center p-4";

  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) {
    return (
      <div className={containerClass}>
        <img
          src={url}
          alt="File Preview"
          className="h-full w-full rounded-md object-contain rounded-xl"
        />
      </div>
    );
  }
  if (["mp4", "webm", "ogg"].includes(ext)) {
    return (
      <div className={containerClass}>
        <video
          src={url}
          controls
          className="max-h-full max-w-full rounded-md"
        />
      </div>
    );
  }
  if (["mp3", "wav"].includes(ext)) {
    return (
      <div className={containerClass}>
        <audio src={url} controls className="w-full" />
      </div>
    );
  }
  if (["pdf"].includes(ext)) {
    return (
      <div className={containerClass}>
        <iframe src={url} className="w-full h-full rounded-md" />
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <File className="w-12 h-12 text-muted-foreground" />
      <p className="text-center text-sm text-muted-foreground">
        No preview available.{" "}
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Download File
        </a>
      </p>
    </div>
  );
}
