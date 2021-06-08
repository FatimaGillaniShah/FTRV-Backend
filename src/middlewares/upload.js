import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { AWS_CONFIG } from '../utils/constants';

const s3 = new AWS.S3({
  accessKeyId: AWS_CONFIG.AWS_ACCESS_KEY,
  secretAccessKey: AWS_CONFIG.AWS_SECRET_KEY,
});

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

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(path.dirname(require.main.filename), UPLOAD_PATH));
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-employee-${file.originalname}`);
//   },
// });

const storage = multerS3({
  s3,
  bucket: AWS_CONFIG.BUCKET,
  metadata(req, file, cb) {
    cb(null, { fieldName: 'TESTING_METADATA' });
  },
  key(req, file, cb) {
    // get key name
    let key = '';
    if (req.originalUrl.indexOf('bannerImage') > -1) {
      key = `${AWS_CONFIG.BANNER_IMAGE}/${req.user.id}-${Date.now()}-${file.originalname}`;
    } else if (req.originalUrl.indexOf('ceo') > -1) {
      key = `${AWS_CONFIG.CEO_PAGE}/${req.user.id}-${Date.now()}-${file.originalname}`;
    } else if (req.originalUrl.indexOf('users') > -1) {
      key = `${AWS_CONFIG.PROFILE_PICTURE}/${req.user.id}-${Date.now()}-${file.originalname}`;
    } else if (req.originalUrl.indexOf('blogs') > -1) {
      key = `${AWS_CONFIG.BLOG_THUMBNAIL}/${req.user.id}-${Date.now()}-${file.originalname}`;
    }
    if (!key) {
      return cb('No matching configuration found');
    }
    cb(null, key);
  },
});

export default function (fileType) {
  const fileFilter = fileType === 'excel' ? excelFilter : imageFilter;
  return multer({ storage, fileFilter });
}
