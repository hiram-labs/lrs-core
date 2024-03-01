import removeDuplicates from './removeDuplicates';

const getStatementBaseAttachments = (statement) => {
  const attachments = statement.attachments;
  if (attachments === undefined) {
    return [];
  }
  return attachments;
};

export default (models) => {
  const attachments = models.reduce((results, model) => {
    const statementAttachments = getStatementBaseAttachments(model.statement);
    const subStatementAttachments =
      model.statement.object.objectType === 'SubStatement' ? getStatementBaseAttachments(model.statement.object) : [];
    return [...results, ...statementAttachments, ...subStatementAttachments];
  }, []);

  const uniqueAttachments = removeDuplicates(attachments, (attachment) => attachment.sha2);

  return uniqueAttachments;
};
