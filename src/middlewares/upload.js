import multer from 'multer';
import path from 'path';
import { UPLOAD_PATH } from '../utils/constants';

const excelFilter = (req, file, cb) => {
  if (file.mimetype.includes('excel') || file.mimetype.includes('spreadsheetml')) {
    cb(null, true);
  } else {
    cb({ message: 'Only excel file uploads are allowed!' }, false);
  }
};

const imageFilter = (req, file, cb) => {
  if (file.mimetype.includes('image')) {
    cb(null, true);
  } else {
    cb({ message: 'Only images are allowed!' }, false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(path.dirname(require.main.filename), '../public', UPLOAD_PATH));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-employee-${file.originalname}`);
  },
});

export default function (fileType) {
  const fileFilter = fileType === 'excel' ? excelFilter : imageFilter;
  return multer({ storage, fileFilter });
}
