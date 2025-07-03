import axios from "axios";

export async function findFileByName(fileName: string) {
  if (!fileName) throw new Error("File name is required");

  const res = await axios.get(`/api/files/search`, {
    params: { name: fileName },
  });

  return res.data;
}
export async function recoverDeletedFile(fileName: string) {
  if (!fileName) throw new Error("File name is required");

  const res = await axios.post(`/api/files/recover`, {
    name: fileName,
  });

  return res.data;
}
export async function createNewFile(fileName: string) {
  if (!fileName) throw new Error("File name is required");

  const res = await axios.post(`/api/files/create`, {
    name: fileName,
  });

  return res.data;
}
export async function addFileToFolder(fileName: string, folderName: string) {
  if (!fileName || !folderName) {
    throw new Error("File name and folder name are required");
  }

  const res = await axios.post(`/api/folders/add-file`, {
    fileName,
    folderName,
  });

  return res.data;
}
