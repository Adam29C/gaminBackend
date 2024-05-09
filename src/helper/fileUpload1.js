const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

// Configure AWS credentials
aws.config.update({
  accessKeyId: 'your_access_key_id',
  secretAccessKey: 'your_secret_access_key',
  region: 'your_s3_bucket_region' // Replace with your S3 bucket region
});

// Create an S3 instance
const s3 = new aws.S3();

// Define multer upload middleware
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'your_s3_bucket_name',
    contentType: multerS3.AUTO_CONTENT_TYPE, // Set the content type automatically
    acl: 'public-read', // Set the file permissions (public-read for public access)
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname); // Generate unique key for the file
    }
  })
});

module.exports = {
  upload
};
