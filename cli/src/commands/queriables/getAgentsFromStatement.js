import { get, has, union } from 'lodash';

const getActorIdent = (actor) => {
  if (actor.mbox !== undefined) {
    return actor.mbox;
  } else if (actor.account !== undefined) {
    return `${actor.account.homePage}|${actor.account.name}`;
  } else if (actor.openid !== undefined) {
    return actor.openid;
  } else if (actor.mbox_sha1sum !== undefined) {
    return actor.mbox_sha1sum;
  }
  throw new Error('Expected an identifier');
};


export const getActorIdents = (actor) => {
  try {
    return [getActorIdent(actor)];
  } catch (err) {
    return [];
  }
};

const getAgentsFromObject = (obj) => {
  switch (obj.objectType) {
    case 'Agent':
      return getActorIdents(obj);
    case 'Group': {
      return (group) => {
        const idents = getActorIdents(group);
        const members = (membersGroup) => {
          if (membersGroup.member === undefined) {
            return [];
          }
          return union(...membersGroup.member.map(getAgentsFromObject));
        };
        return [...idents, ...members];
      };
    }
    default:
      return [];
  }
};


const getAgentsFromTeam = (statement) => {
  const path = ['context', 'team'];
  if (has(statement, path)) {
    const team = get(statement, path);
    return getAgentsFromObject(team);
  }
  return [];
};

const getAgentsFromInstructor = (statement) => {
  const path = ['context', 'instructor'];
  if (has(statement, path)) {
    const team = get(statement, path);
    return getAgentsFromObject(team);
  }
  return [];
};


export const getAgentsFromStatement = (statement) => union([...getAgentsFromObject(statement.actor), ...getAgentsFromObject(statement.object)]);

const getRelatedAgentsFromStatementBase = (statement) => [
  ...getAgentsFromStatement(statement),
  ...getAgentsFromTeam(statement),
  ...getAgentsFromInstructor(statement)
];

const getAgentsFromSubStatement = (statement) => {
  if (statement.object.objectType === 'SubStatement') {
    return getRelatedAgentsFromStatementBase(statement.object);
  }
  return [];
};

export const getRelatedAgentsFromStatement = (statement) => union([
  ...getRelatedAgentsFromStatementBase(statement),
  ...getAgentsFromObject(statement.authority),
  ...getAgentsFromSubStatement(statement)
]);
