import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useDropzone } from "react-dropzone";
import firebase from "../pages/firebase";

const ImageUploader = () => {
  const handleImageUpload = async (file) => {
    const storageRef = getStorage(firebase);
    const fileRef = ref(storageRef, file.name);

    await uploadBytes(fileRef, file);
    console.log("Image uploaded successfully!");
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      handleImageUpload(file);
    },
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-gray-300 border-dashed rounded-md p-6 text-center cursor-pointer"
    >
      <input {...getInputProps()} />
      <p className="text-lg text-gray-600">
        Drag and drop an image file here, or click to select a file
      </p>
    </div>
  );
};

export default ImageUploader;
