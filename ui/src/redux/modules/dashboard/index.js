import * as blankDashboard from './blankDashboard';
import * as copyDashboard from './copyDashboard';
import * as streamStarter from './streamStarter';
import * as gettingStarted from './gettingStarted';

/*
 * Sagas
 */

export const sagas = [...blankDashboard.sagas, ...copyDashboard.sagas, ...streamStarter.sagas, ...gettingStarted.sagas];
