import { get, has, union } from 'lodash';

const getActivityIdsFromObject = (obj) => {
  if (obj.objectType === 'Activity') {
    return [obj.id];
  }
  return [];
};

const getActivitiesFromContextActivities = (statement, key) => {
  const path = ['context', 'contextActivities', key];
  if (has(statement, path)) {
    const activities = get(statement, path);
    return union(...activities.map(getActivityIdsFromObject));
  }

  return [];
};

const getActivitiesFromStatementBase = (statement) => [
  ...getActivityIdsFromObject(statement.object),
  ...getActivitiesFromContextActivities(statement, 'parent'),
  ...getActivitiesFromContextActivities(statement, 'grouping'),
  ...getActivitiesFromContextActivities(statement, 'category'),
  ...getActivitiesFromContextActivities(statement, 'other')
];

const getActivitiesFromSubStatement = (statement) => {
  if (statement.object.objectType === 'SubStatement') {
    return getActivitiesFromStatementBase(statement.object);
  }

  return [];
};

export const getActivitiesFromStatement = (statement) => getActivityIdsFromObject(statement.object);

export const getRelatedActivitiesFromStatement = (statement) => union([...getActivitiesFromStatementBase(statement), ...getActivitiesFromSubStatement(statement)]);
