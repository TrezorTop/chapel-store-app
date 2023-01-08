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
