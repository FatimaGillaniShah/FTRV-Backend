import multer from 'multer';
import path from 'path';
import { EXCEL_UPLOAD_PATH } from '../utils/constants';

const excelFilter = (req, file, cb) => {
  if (file.mimetype.includes('excel') || file.mimetype.includes('spreadsheetml')) {
    cb(null, true);
  } else {
    cb({ message: 'Only excel file uploads are allowed!' }, false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(path.dirname(require.main.filename), EXCEL_UPLOAD_PATH));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-employee-${file.originalname}`);
  },
});

const uploadFile = multer({ storage, fileFilter: excelFilter });
export default uploadFile;
