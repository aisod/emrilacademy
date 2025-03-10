
/**
 * Utility functions for resources
 */

export function getCategoryLabel(category?: string | null) {
  switch (category) {
    case "lecture":
      return "Lecture Notes";
    case "assignment":
      return "Assignment";
    case "reading":
      return "Reading Material";
    case "reference":
      return "Reference";
    default:
      return "General";
  }
}

export function getCategoryColor(category?: string | null) {
  switch (category) {
    case "lecture":
      return "blue";
    case "assignment":
      return "yellow";
    case "reading":
      return "green";
    case "reference":
      return "purple";
    default:
      return "gray";
  }
}

export function getFileIcon(fileUrl: string) {
  const extension = fileUrl.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'file-text';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
    case 'webp':
      return 'image';
    case 'mp3':
    case 'wav':
    case 'ogg':
      return 'music';
    case 'mp4':
    case 'webm':
    case 'avi':
    case 'mov':
      return 'video';
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
      return 'archive';
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
    case 'html':
    case 'css':
    case 'py':
    case 'java':
      return 'code';
    default:
      return 'file';
  }
}
