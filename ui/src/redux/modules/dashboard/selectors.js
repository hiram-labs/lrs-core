import { List } from 'immutable';
import { createSelector } from 'reselect';
import { modelsSchemaIdSelector } from 'ui/redux/selectors';

export const getVisualisationsFromDashboard = (dashboardId) =>
  createSelector(
    [(state) => state, modelsSchemaIdSelector('dashboard', dashboardId, { deep: true })],
    (state, dashboard) =>
      dashboard
        .get('widgets', new List())
        .map((widget) => modelsSchemaIdSelector('visualisation', widget.get('visualisation'), { deep: true })(state))
  );
