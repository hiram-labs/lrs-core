import { S3Client, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Readable } from 'stream';
import commonS3Repo from '@hiram-labs/lrs-js-common/dist/s3Repo';
import streamToString from 'stream-to-string';
import defaultTo from 'lodash/defaultTo';
import trim from 'lodash/trim';
import { getAttachmentDir, getAttachmentPath } from './commons';


const stringToStream = (data) => Readable.from(data);


const getStreamData = async (stream) => {
  let data = '';

  await new Promise((resolve, reject) => {
    stream.on('data', (chunk) => {
      data += chunk.toString('binary');
    });

    stream.on('end', () => {
      resolve();
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });

  return trim(data, '\r\n ');
};


const createAttachments = (config) => async ({ lrs_id, models }) => {
  const dir = getAttachmentDir({ subFolder: config.subFolder, lrs_id });
  const promises = models.map(async (model) => {
    const filePath = getAttachmentPath({
      dir,
      hash: model.hash,
      contentType: model.contentType
    });
    const content = await streamToString(model.stream);
    const target = {
      Body: Buffer.from(content, 'binary'),
      Bucket: config.bucketName,
      Key: filePath,
      ContentEncoding: 'binary',
      ContentLength: content.length
    };
    const upload = new Upload({
      client: config.client,
      params: target
    });

    await upload.done();
  });
  await Promise.all(promises);
};

const getAttachment = (config) => async ({ contentType, hash, lrs_id }) => {
  const dir = getAttachmentDir({ subFolder: config.subFolder, lrs_id });
  const filePath = getAttachmentPath({ dir, hash, contentType });

  const objectConfig = {
    Bucket: config.bucketName,
    Key: filePath
  };

  const s3HeadObjectCommand = new HeadObjectCommand(objectConfig);
  const s3HeadObject = await config.client.send(s3HeadObjectCommand);

  const contentLength = s3HeadObject.ContentLength;

  const getObjectCommand = new GetObjectCommand({
    ...objectConfig,
    ResponseContentEncoding: 'binary'
  });
  const { Body } = await config.client.send(getObjectCommand);

  const streamAsString = await getStreamData(Body);
  const streamAsStream = stringToStream(streamAsString);
  return { stream: streamAsStream, contentLength };
};

export default (factoryConfig = {}) => {
  const facadeConfig = {
    client: new S3Client({
      tls: true,
      apiVersion: '2006-03-01',
      ...factoryConfig.awsConfig
    }),
    bucketName: defaultTo(factoryConfig.bucketName, 'xapi-server'),
    subFolder: defaultTo(factoryConfig.subFolder, '/storage')
  };
  return {
    ...commonS3Repo(facadeConfig),
    createAttachments: createAttachments(facadeConfig),
    getAttachment: getAttachment(facadeConfig)
  };
};
