import mongoose from 'mongoose';
import Statement from 'lib/models/statement';
import personaService from 'lib/connections/personaService';
import getActorFilterFromIfi from './utils/getActorFilterFromIfi';

const ObjectId = mongoose.Types.ObjectId;

export default async ({ organisation, toIdentifierId }) => {
  const { identifier } = await personaService().getIdentifier({
    organisation,
    id: toIdentifierId
  });

  const { persona } = await personaService().getPersona({
    organisation,
    personaId: identifier.persona
  });

  const actorFilter = getActorFilterFromIfi(identifier.ifi);
  const filter = {
    organisation: new ObjectId(organisation),
    ...actorFilter
  };

  // always update the display
  const update = {
    personaIdentifier: new ObjectId(toIdentifierId),
    person: {
      _id: new ObjectId(identifier.persona),
      display: persona.name
    }
  };

  await Statement.updateMany(filter, update);
};
