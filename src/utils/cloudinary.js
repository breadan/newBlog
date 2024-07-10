import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

//upload function
const cloudinaryUpload = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(
      fileToUpload,
      function (error, result) {
        console.log(result, error);
      }
    );

    return data;
  } catch (e) {
    return e;
  }
};

//remove function
const cloudinaryRemove = async (imagePublicId) => {
  try {
    const result = await cloudinary.uploader.destroy(imagePublicId);
    return result;
  } catch (e) {
    return e;
  }
};

export { cloudinaryUpload, cloudinaryRemove };
