import axios from "axios";

// Find a file by name
export async function findFileByName(fileName: string) {
  const res = await axios.get("/api/files", {
    params: { title: fileName },
  });
  return res.data;
}

// Recover deleted file by setting status to 'active'
export async function recoverDeletedFile(fileName: string) {
  if (!fileName) throw new Error("File name is required");

  // Step 1: Find file by name
  const res = await axios.get("/api/files", {
    params: { title: fileName },
  });

  const file = res.data.files?.[0];
  if (!file) throw new Error("File not found");

  // Step 2: Update file status
  const updateRes = await axios.put(`/api/files?id=${file._id}`, {
    status: "active",
  });

  return updateRes.data;
}

// Create a new file
export async function createNewFile(fileName: string) {
  const res = await axios.post("/api/files", {
    title: fileName,
  });
  return res.data;
}

// Add a file to a folder
export async function addFileToFolder(fileName: string, folderName: string) {
  // Find file
  const res = await axios.get("/api/files", {
    params: { title: fileName },
  });
  const file = res.data.files?.[0];
  if (!file) throw new Error("File not found");

  // Update file's folder
  const updateRes = await axios.put(`/api/files?id=${file._id}`, {
    folder: folderName,
  });
  return updateRes.data;
}
