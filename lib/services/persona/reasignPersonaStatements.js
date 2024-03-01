import mongoose from 'mongoose';
import Statement from 'lib/models/statement';
import personaService from 'lib/connections/personaService';

const ObjectId = mongoose.Types.ObjectId;

export default async ({ fromId, toId, organisation }) => {
  const { persona: toPersona } = await personaService().getPersona({
    organisation,
    personaId: toId
  });

  const filter = {
    organisation: new ObjectId(organisation),
    'person._id': new ObjectId(fromId)
  };

  // always update the display
  const update = {
    'person.display': toPersona.name
  };

  // only update the ID if required
  if (fromId !== toId) {
    update['person._id'] = new ObjectId(toId);
  }

  await Statement.updateMany(filter, update);
};
