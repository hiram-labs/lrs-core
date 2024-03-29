import Organisation from 'lib/models/organisation';
import Lrs from 'lib/models/lrs';
import Client from 'lib/models/client';
import User from 'lib/models/user';
import Statement from 'lib/models/statement';
import OAuthToken from 'lib/models/oAuthToken';
import async from 'async';
import * as scopes from 'lib/constants/scopes';

export default class journeyDBHelpers {
  prepare = (done) => {
    async.parallel(
      {
        organisation: (insertDone) =>
          Organisation.create(
            {
              _id: '561a679c0c5d017e4004714f',
              name: 'Test organisation'
            }).then((result) => insertDone(null, result)).catch((err) => insertDone(err, null)),
        user: (insertDone) => {
          const out = User.create(
            {
              _id: '561a679c0c5d017e4004714f',
              email: 'testy@mctestface.com',
              password: 'password1',
              organisations: ['561a679c0c5d017e4004714f'],
              organisationSettings: [
                {
                  organisation: '561a679c0c5d017e4004714f',
                  scopes: [scopes.ALL]
                }
              ],
              scopes: []
            }).then((result) => insertDone(null, result)).catch((err) => insertDone(err, null));
          return out;
        },
        lrs: (insertDone) =>
          Lrs.create(
            {
              _id: '561a679c0c5d017e4004714f',
              owner_id: '561a679c0c5d017e4004714f',
              organisation: '561a679c0c5d017e4004714f',
              title: 'Test store',
              description: 'Test'
            }).then((result) => insertDone(null, result)).catch((err) => insertDone(err, null))
      },
      (err, results) => {
        if (err) return done(err);
        this.user = results.user;
        this.organisation = results.organisation;
        this.lrs = results.lrs;
        Client.findOne({ organisation: results.organisation, lrs_id: this.lrs._id }).then((client) => {
          this.client = client;
          return done();
        }).catch(done);
      }
    );
  };

  cleanUp = (done) => {
    async.forEach(
      [Organisation, User, Lrs, Client, Statement, OAuthToken],
      (model, doneDeleting) => {
        model.deleteMany({}).then(() => doneDeleting()).catch((err) => doneDeleting(err));
      },
      done
    );
  };
}
