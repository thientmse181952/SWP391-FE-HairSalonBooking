import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase";

const uploadFile = async (file: File): Promise<string> => {
  // Tạo tham chiếu tới vị trí lưu trữ trên Firebase với tên file
  const storageRef = ref(storage, file.name);

  // Upload file lên Firebase
  const response = await uploadBytes(storageRef, file);

  // Lấy URL của file vừa upload
  const downloadURL = await getDownloadURL(response.ref);
  return downloadURL;
};

export default uploadFile;
