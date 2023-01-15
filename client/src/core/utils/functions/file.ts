export const decodeFile = (fileName?: string, fileData?: string) => {
  const contentType = "application/zip";
  const sliceSize = 512;

  const byteCharacters = atob(fileData!);
  const byteArrays = [];

  for (let offset = 0, length = byteCharacters.length; offset < length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0, length = slice.length; i < length; i += 1) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = fileName ?? "archive.zip";
  link.href = url;

  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return "0 B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

interface IRuntimeForm {
  [key: string]: any;
}
