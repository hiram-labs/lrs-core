import personaService from '@hiram-labs/lrs-persona-service/dist/service';
import mongoModelsRepo from '@hiram-labs/lrs-persona-service/dist/mongoModelsRepo';
import config from '@hiram-labs/lrs-persona-service/dist/config';
import createMongoClient from '@hiram-labs/lrs-persona-service/dist/repoFactory/utils/createMongoClient';

let service;

const getService = () => {
  if (service) return service;

  service = personaService({
    repo: mongoModelsRepo({
      db: createMongoClient({
        url: process.env.MONGODB_PATH,
        options: config.mongoModelsRepo.options
      })
    })
  });

  return service;
};

export default getService;
