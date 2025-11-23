import axios from 'axios';
import imageCompression from 'browser-image-compression';

export const uploadImage = async (file: File) => {
  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp',
      initialQuality: 0.8,
    });
    const formData = new FormData();
    formData.append('image', compressed, `${crypto.randomUUID()}.webp`);
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
      formData,
    );
    return response.data.data.url;
  } catch (error) {
    return '';
  }
};
