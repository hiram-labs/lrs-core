import commonFsRepo from '@hiram-labs/lrs-js-common/dist/fsRepo';
import defaultTo from 'lodash/defaultTo';
import * as fs from 'fs-extra';
import streamToString from 'stream-to-string';
import { getAttachmentDir, getAttachmentPath } from './commons';


const getAttachment = (config) => async ({ contentType, hash, lrs_id }) => {
  const dir = getAttachmentDir({ subFolder: config.storageDir, lrs_id });
  const filePath = getAttachmentPath({ dir, hash, contentType });
  const isExisting = await fs.pathExists(filePath);
  if (!isExisting) {
    throw new Error(`Missing attachment file path ${filePath}`);
  }
  const stream = fs.createReadStream(filePath, { encoding: 'binary' });
  const stats = await fs.stat(filePath);
  const contentLength = stats.size;
  return { stream, contentLength };
};

const createAttachments = (config) => async ({ lrs_id, models }) => {
  const dir = getAttachmentDir({ subFolder: config.storageDir, lrs_id });
  await fs.ensureDir(dir);
  const promises = models.map(async (model) => {
    const filePath = getAttachmentPath({
      dir,
      hash: model.hash,
      contentType: model.contentType
    });
    const content = await streamToString(model.stream);
    await fs.writeFile(filePath, content, { encoding: 'binary' });
  });
  await Promise.all(promises);
};


export default (factoryConfig = {}) => {
  const facadeConfig = {
    storageDir: defaultTo(factoryConfig.storageDir, '/storage')
  };
  return {
    ...commonFsRepo(facadeConfig),
    createAttachments: createAttachments(facadeConfig),
    getAttachment: getAttachment(facadeConfig)
  };
};
