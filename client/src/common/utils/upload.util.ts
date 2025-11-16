import axios from 'axios';

export const uploadImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
      formData,
    );
    return response.data.data.url;
  } catch (error) {
    return '';
  }
};
