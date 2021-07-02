import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { AWS_CONFIG, UPLOAD_PATH } from '../utils/constants';

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

const documentFilter = (req, file, cb) => {
  const notAllowedMimetype = ['application/x-msdos-program'];
  if (!file.mimetype.includes(notAllowedMimetype)) {
    cb(null, true);
  } else {
    cb({ message: '.exe file is not allowed' }, false);
  }
};

const storageDisk = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(path.dirname(require.main.filename), UPLOAD_PATH));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-employee-${file.originalname}`);
  },
});

const storageS3 = multerS3({
  s3,
  bucket: AWS_CONFIG.BUCKET,
  metadata(req, file, cb) {
    cb(null, {});
  },
  key(req, file, cb) {
    // get key name
    let key = '';
    const fileSuffix = `${req.user.id}-${Date.now()}-${file.originalname}`;
    if (req.originalUrl.indexOf('bannerImage') > -1) {
      key = `${AWS_CONFIG.BANNER_IMAGE}/${fileSuffix}`;
    } else if (req.originalUrl.indexOf('ceo') > -1) {
      key = `${AWS_CONFIG.CEO_PAGE}/${fileSuffix}`;
    } else if (req.originalUrl.indexOf('users') > -1) {
      key = `${AWS_CONFIG.PROFILE_PICTURE}/${fileSuffix}`;
    } else if (req.originalUrl.indexOf('blogs') > -1) {
      key = `${AWS_CONFIG.BLOG_THUMBNAIL}/${fileSuffix}`;
    } else if (req.originalUrl.indexOf('documents') > -1) {
      key = `${AWS_CONFIG.DOCUMENT_FILE}/${fileSuffix}`;
    }
    if (!key) {
      return cb('No matching configuration found');
    }
    cb(null, key);
  },
});

const filter = (fileType) => {
  const filterType = {
    excel: excelFilter,
    image: imageFilter,
    document: documentFilter,
  };
  const filterMethod = filterType[fileType];
  return filterMethod;
};

export default function (fileType) {
  const fileFilter = filter(fileType);
  return multer({
    storage: fileType === 'excel' ? storageDisk : storageS3,
    fileFilter,
  });
}
