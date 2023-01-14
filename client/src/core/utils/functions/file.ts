export const generateFile = (fileName?: string, fileData?: string) => {
  const blob = new Blob([fileData ?? "No File Data Provided"], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = fileName ?? "file.txt";
  link.href = url;
  link.click();

  link.remove();
  URL.revokeObjectURL(url);
};

export const decodeFile = (base64: string, filename: string) => {
  if (!base64) return;

  let arr = base64.split(",");
  const mime = arr[0]?.match(/:(.*?);/)?.[1];
  const bstr = atob(arr[0]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
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

export class RuntimeForm<T extends IRuntimeForm> {
  constructor(private _form: T) {}
  public formData(): FormData {
    const form = new FormData();

    for (const key in this._form) {
      if (this._form[key] !== undefined) {
        form.append(key, this._form[key]);
      }
    }

    return form;
  }
}

new RuntimeForm<{ foo: string }>({ foo: "bar" });
