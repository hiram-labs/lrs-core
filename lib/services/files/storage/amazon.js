import fs from 'fs';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import logger from 'lib/logger';
import defaultTo from 'lodash/defaultTo';
import { join } from 'path';

const subfolder = defaultTo(process.env.FS_SUBFOLDER, 'storage');

const getPrefixedPath = (path) => join(subfolder, path);

const uploadToClient = (client) => (config) => (path, fromStream) =>
  client.send(new PutObjectCommand({ ...config, Key: getPrefixedPath(path), Body: fromStream }));

const downloadFromClient = (client) => (config) => (path) =>
  client.send(new GetObjectCommand({ ...config, Key: getPrefixedPath(path) }));

export const createStreamUploader = (client) => (config) => (toPath) => (fromStream) =>
  uploadToClient(client)(config)(toPath, fromStream)
    .then((data) => {
      logger.debug(`UPLOADED TO ${toPath}`);
      logger.silly(`full uploaded URL ${data.Location}`);
    })
    .catch((err) => {
      logger.error(`Error ${err}`);
    });

export const createPathUploader = (streamUploader) => (toPath) => (fromPath) => {
  const fromStream = fs.createReadStream(fromPath);
  fromStream.on('error', (err) => {
    logger.error(`File Error ${err.message}`);
  });
  return streamUploader(toPath)(fromStream);
};
export const createStreamDownloader = (client) => (config) => (fromPath) => (toStream) =>
  downloadFromClient(client)(config)(fromPath).then(
    (data) =>
      new Promise((resolve, reject) => {
        const readStream = data.Body;
        logger.debug(`DOWNLOADING FROM ${fromPath}`);
        toStream.on('error', reject);
        toStream.on('finish', resolve);
        readStream.pipe(toStream);
      })
  );

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.FS_AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.FS_AWS_S3_SECRET_ACCESS_KEY
  },
  region: process.env.FS_AWS_S3_REGION
});

const Bucket = process.env.FS_AWS_S3_BUCKET;
export const uploadFromStream = createStreamUploader(client)({ Bucket });
export const uploadFromPath = createPathUploader(uploadFromStream);
export const downloadToStream = createStreamDownloader(client)({ Bucket });

export default {
  uploadFromStream,
  uploadFromPath,
  downloadToStream
};
