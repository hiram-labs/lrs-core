import { filter } from 'bluebird';
import getStatementsAttachments from './getStatementsAttachments';

export default async (
  config,
  models,
  hasAttachments,
  lrsId
) => {
  if (!hasAttachments) {
    return [];
  }

  const attachments = getStatementsAttachments(models);
  const potentialAttachments = attachments.map((attachment) => ({
    fileUrl: attachment.fileUrl,
    hash: attachment.sha2,
    attachmentRequest: config.repo.getAttachment({
      lrs_id: lrsId,
      hash: attachment.sha2,
      contentType: attachment.contentType
    }),
    contentType: attachment.contentType
  }));
  const storedAttachments = await Promise.resolve(
    filter(potentialAttachments, async (potentialAttachment) => {
      try {
        await potentialAttachment.attachmentRequest;
        return true;
      } catch (err) {
        if (potentialAttachment.fileUrl === undefined) {
          throw err;
        }
        return false;
      }
    })
  );
  const streamedAttachments = storedAttachments.map(async (storedAttachment) => {
    const attachmentResult = await storedAttachment.attachmentRequest;
    return {
      hash: storedAttachment.hash,
      stream: attachmentResult.stream,
      contentLength: attachmentResult.contentLength,
      contentType: storedAttachment.contentType
    };
  });
  const awaitedAttachments = await Promise.all(streamedAttachments);
  return awaitedAttachments;
};
