const S3Plugin = require('webpack-s3-plugin');

module.exports = {
  plugins: [
    new S3Plugin({
      // s3Options are required
      s3Options: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_KEY,
        region: process.env.AWS_REGION,
      },
      s3UploadOptions: {
        Bucket: process.env.AWS_BUCKET,
      },
    }),
  ],

};
