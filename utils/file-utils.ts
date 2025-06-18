export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function getFileIcon(type: string): string {
  if (type.startsWith("image/")) return "🖼️"
  if (type.startsWith("video/")) return "🎥"
  if (type.startsWith("audio/")) return "🎵"
  if (type.includes("pdf")) return "📄"
  if (type.includes("word") || type.includes("document")) return "📝"
  if (type.includes("excel") || type.includes("spreadsheet")) return "📊"
  if (type.includes("zip") || type.includes("archive")) return "📦"
  return "📁"
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}
