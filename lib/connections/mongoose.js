import mongoose from 'mongoose';
import logger from 'lib/logger';
import defaultTo from 'lodash/defaultTo';

const connections = {};

const uri = process.env.MONGODB_PATH;
const maxPoolSize = defaultTo(Number(process.env.MONGO_CONNECTION_POOLSIZE), 20);
const socketTimeoutMS = defaultTo(Number(process.env.MONGO_SOCKET_TIMEOUT_MS), 300000);

const createConnection = () => {
  logger.silly('Creating Mongo connection');
  return mongoose.createConnection(uri, { socketTimeoutMS, maxPoolSize });
};

const handleError = (namespace, msg) => {
  try {
    logger.error(msg);
    connections[namespace].close();
    logger.info(`Mongo connection instance ${namespace} cleaned up properly.`);
    connections[namespace] = null;
  } catch (error) {
    logger.error(`Mongo connection instance ${namespace} error handling raised another error.`);
    logger.error(error);
  }
};

const handleConnected = (namespace, msg) => {
  logger.info(msg);
};

const waitForReadyState = (connection, timeoutSeconds = 15) => {
  const timeout = new Date().getTime() + timeoutSeconds * 1000;
  while (new Date().getTime() <= timeout) {
    logger.silly('Waiting for connection readyState');
    if (connection.readyState) return;
  }
  throw new Error(`Could not secure a connection readyState after ${timeoutSeconds} seconds`);
};

const getConnection = (namespace = 'll') => {
  if (connections[namespace]) return connections[namespace];
  connections[namespace] = createConnection();
  connections[namespace].on('connected', () =>
    handleConnected(namespace, `Mongo connection instance ${namespace} connected successfully.`)
  );
  connections[namespace].on('disconnecting', () =>
    handleError(namespace, `Mongo connection instance ${namespace} is disconnecting.`)
  );
  connections[namespace].on('disconnected', () =>
    handleError(namespace, `Mongo connection instance ${namespace} disconnected.`)
  );
  connections[namespace].on('close', () => handleError(namespace, `Mongo connection instance ${namespace} close.`));
  waitForReadyState(connections[namespace]);
  return connections[namespace];
};

const getConnections = () => connections;

export { getConnection, getConnections };
