import {
  STATEMENT_QUEUE,
  STATEMENT_QUERYBUILDERCACHE_QUEUE,
  STATEMENT_EXTRACT_PERSONAS_QUEUE,
  STATEMENT_FORWARDING_QUEUE,
  STATEMENT_FORWARDING_REQUEST_QUEUE,
  STATEMENT_FORWARDING_DEADLETTER_QUEUE
} from 'lib/constants/statements';
import { map } from 'lodash';
import { getPrefixedQueueName } from 'lib/services/queue';
import { getQueue } from 'lib/services/queue/bull';
import { createHmac } from 'crypto';

const queueNames = [
  STATEMENT_QUEUE,
  STATEMENT_QUERYBUILDERCACHE_QUEUE,
  STATEMENT_EXTRACT_PERSONAS_QUEUE,
  STATEMENT_FORWARDING_QUEUE,
  STATEMENT_FORWARDING_REQUEST_QUEUE,
  STATEMENT_FORWARDING_DEADLETTER_QUEUE
];

const purgeBullQueues = () => {
  if (process.env.QUEUE_PROVIDER !== 'BULL' && process.env.QUEUE_PROVIDER !== 'REDIS') {
    return Promise.resolve();
  }

  const purgeQueues = map(queueNames, async (item) => {
    const prefixedQueueName = getPrefixedQueueName(item);
    const queue = await new Promise((resolve, reject) =>
      getQueue(prefixedQueueName, (err, queue2) => (err ? reject(err) : resolve(queue2)))
    );

    if (queue.client.domain || queue.client.options.host !== '127.0.0.1') {
      throw new Error('Attempting to purge non dev queue');
    }

    return queue.empty();
  });

  return Promise.all(purgeQueues);
};

export const purgeQueues = () => {
  switch (process.env.QUEUE_PROVIDER) {
    case 'REDIS':
    case 'BULL':
      return purgeBullQueues();
    default:
      return Promise.resolve();
  }
};

export const createSha = (content) => createHmac('sha256', 'secret').update(content).digest('hex');
