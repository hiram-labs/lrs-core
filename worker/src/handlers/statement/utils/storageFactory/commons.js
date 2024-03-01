import { extension } from 'mime-types';


const getFileExtension = (contentType) => {
  const ext = extension(contentType);
  if (ext === false) {
    return 'bin';
  }
  return ext;
};


const getAttachmentFilename = (opts) => {
  const ext = getFileExtension(opts.contentType);
  return `${opts.hash}.${ext}`;
};

export const getAttachmentPath = (opts) => {
  const filename = getAttachmentFilename(opts);
  return `${opts.dir}/${filename}`;
};

export const getAttachmentDir = (opts) => {
  if (opts.subFolder !== undefined) {
    return `${opts.subFolder}/${opts.lrs_id}/attachments`;
  }
  return `${opts.lrs_id}/attachments`;
};
