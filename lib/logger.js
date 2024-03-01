import os from 'os';
import commonWinston from '@hiram-labs/lrs-js-common/dist/winston';
import getBooleanOption from '@hiram-labs/lrs-js-common/dist/config/getBooleanOption';
import getStringOption from '@hiram-labs/lrs-js-common/dist/config/getStringOption';

const config = {
  winston: {
    cloudWatch: {
      awsConfig: {
        accessKeyId: getStringOption(process.env.WINSTON_CLOUDWATCH_ACCESS_KEY_ID),
        region: getStringOption(process.env.WINSTON_CLOUDWATCH_REGION),
        secretAccessKey: getStringOption(process.env.WINSTON_CLOUDWATCH_SECRET_ACCESS_KEY)
      },
      enabled: getBooleanOption(process.env.WINSTON_CLOUDWATCH_ENABLED, false),
      level: getStringOption(process.env.LOG_MIN_LEVEL, 'info'),
      logGroupName: getStringOption(process.env.WINSTON_CLOUDWATCH_LOG_GROUP_NAME, 'llv2'),
      logStreamName: getStringOption(process.env.WINSTON_CLOUDWATCH_LOG_STREAM_NAME, os.hostname())
    },
    console: {
      level: getStringOption(process.env.LOG_MIN_LEVEL, 'info')
    }
  }
};

export default commonWinston({
  cloudWatch: {
    awsConfig: {
      accessKeyId: config.winston.cloudWatch.awsConfig.accessKeyId,
      region: config.winston.cloudWatch.awsConfig.region,
      secretAccessKey: config.winston.cloudWatch.awsConfig.secretAccessKey
    },
    enabled: config.winston.cloudWatch.enabled,
    level: config.winston.cloudWatch.level,
    logGroupName: config.winston.cloudWatch.logGroupName,
    logStreamName: config.winston.cloudWatch.logStreamName
  },
  console: {
    level: config.winston.console.level
  }
});
