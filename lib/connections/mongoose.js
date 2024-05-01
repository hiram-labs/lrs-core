import mongoose from 'mongoose';
import logger from 'lib/logger';
import defaultTo from 'lodash/defaultTo';

const connections = {};

const uri = process.env.MONGODB_PATH;
const maxPoolSize = defaultTo(Number(process.env.MONGO_CONNECTION_POOLSIZE), 20);
const socketTimeoutMS = defaultTo(Number(process.env.MONGO_SOCKET_TIMEOUT_MS), 300000);

const createConnection = (namespace) => {
  logger.silly('Creating Mongo connection');
  const connection = mongoose.createConnection(uri, { socketTimeoutMS, maxPoolSize });

  connection.on('error', (error) => {
    logger.error(`MongoDB connection error for namespace ${namespace}: ${error}`);
  });

  return connection;
};

const handleConnected = (namespace, msg) => {
  logger.info(msg);
  if (!connections[namespace]) {
    logger.crit(
      `Mongo connection instance ${namespace} can not be found in the connection map. This indicates a memory leak.`
    );
  }
};

const handleClosed = (namespace, msg) => {
  logger.error(msg);
  if (connections[namespace]) {
    connections[namespace] = null;
  }
};

const getConnection = (namespace = 'default') => {
  if (!connections[namespace]) {
    connections[namespace] = createConnection(namespace);
    connections[namespace].on('connected', () => {
      handleConnected(namespace, `Mongo connection instance ${namespace} connected successfully.`);
    });
    connections[namespace].on('reconnected', () => {
      logger.info(`Mongo connection instance ${namespace} is reconnected.`);
    });
    connections[namespace].on('disconnecting', () => {
      logger.info(`Mongo connection instance ${namespace} is disconnecting.`);
    });
    connections[namespace].on('disconnected', () => {
      logger.info(`Mongo connection instance ${namespace} disconnected.`);
    });
    connections[namespace].on('close', () => {
      handleClosed(namespace, `Mongo connection instance ${namespace} closed.`);
    });
  }
  return connections[namespace];
};

const getConnections = () => connections;

export { getConnection, getConnections };
