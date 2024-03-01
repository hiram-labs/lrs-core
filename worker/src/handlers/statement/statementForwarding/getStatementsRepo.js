import once from 'lodash/once';
import defaultTo from 'lodash/defaultTo';
import { join as joinPath } from 'path';
import localFactory from '../utils/storageFactory/localFactory';
import s3Factory from '../utils/storageFactory/s3Factory';


const storageFactory = (config) => {
  switch (config.facade) {
    case 's3':
      return s3Factory(config.s3);
    case 'local':
    default:
      return localFactory(config.local);
  }
};

const createStatementsRepo = (config) => {
  const storageRepo = storageFactory(config.storage);

  return {
    ...storageRepo,

    clearRepo: async () => {
      await Promise.all([storageRepo.clearRepo()]);
    },
    migrate: async () => {
      await Promise.all([storageRepo.migrate()]);
    },
    rollback: async () => {
      await Promise.all([storageRepo.rollback()]);
    }
  };
};

export default once(() => {
  const endpoint = defaultTo(process.env.FS_LOCAL_ENDPOINT, process.cwd());
  const subFolder = defaultTo(process.env.FS_SUBFOLDER, 'storage');
  const statementsSubFolder = defaultTo(process.env.SUB_FOLDER_STATEMENTS, 'statements');
  return createStatementsRepo({
    storage: {
      facade: process.env.FS_REPO === 'amazon' ? 's3' : process.env.FS_REPO,
      local: {
        storageDir: joinPath(endpoint, subFolder, statementsSubFolder)
      },
      s3: {
        awsConfig: {
          accessKeyId: process.env.FS_AWS_S3_ACCESS_KEY_ID,
          apiVersion: '2006-03-01',
          region: process.env.FS_AWS_S3_REGION,
          secretAccessKey: process.env.FS_AWS_S3_SECRET_ACCESS_KEY,
          signatureVersion: 'v4',
          sslEnabled: true
        },
        bucketName: process.env.FS_AWS_S3_BUCKET,
        subFolder: process.env.FS_SUBFOLDER
      }
    }
  });
});
