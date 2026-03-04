import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../services/firebase";
import { isHttpUrl } from "./validation";

export const uploadImageToFirebase = async (
  file: File | string | undefined,
): Promise<string | null> => {
  if (!file) return "";
  if (isHttpUrl(file as string)) return file as string;

  return new Promise((resolve, reject) => {
    const fileUpload: File = file as File;
    const storageRef = ref(storage, `images/${fileUpload?.name}`);
    const uploadTask = uploadBytesResumable(storageRef, fileUpload);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("progress upload: ", uploadProgress);
      },
      (error) => {
        console.error("Upload error:", error);
        reject("");
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          console.error("Error getting download URL:", error);
          reject("");
        }
      },
    );
  });
};

export const getImageUrl = async (img?: string | File): Promise<string> => {
  if (!img) return "";
  if (typeof img === "string") return img; // already a URL
  return (await uploadImageToFirebase(img)) ?? "";
};
