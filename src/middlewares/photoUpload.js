import multer from 'multer';

const multerMiddle = () => {
  // const imageDirname = 'images';
  const photoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
      if (file) {
        cb(
          null,
          new Date().toISOString().replace(/:/g, '-') + file.originalname
        );
      } else {
        cb(null, false);
      }
    },
  });
  const file = multer({
    // dest: 'uploads',
    storage: photoStorage,
    fileFilter: function (req, file, cb) {
      if (file.mimetype.startsWith('image')) {
        //u can put formatted image here
        cb(null, true);
      } else {
        cb({ message: 'Unsupported File format' }, false);
      }
    },
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
  });
  return file;
};

export { multerMiddle };
