import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'api/auth/passport';
import HttpRoutes from 'api/routes/HttpRoutes';
import logger from 'lib/logger';
import { install } from 'source-map-support';

install();

process.on('SIGINT', () => { process.exit(0); });
const corsMiddleware = cors({ origin: '*', preflightContinue: true });
const app = express();
app.use(corsMiddleware);
app.options('*', corsMiddleware);

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(HttpRoutes);

if (process.env.API_PORT) {
  app.listen(process.env.API_PORT, (err) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    } else {
      logger.info(
        '\n------------------------------------------------------------------\n' +
          `==> 🌎  API is running on port ${process.env.API_PORT}.` +
          '\n' +
          `==> 💻  Send requests to http://${process.env.API_HOST}:${process.env.API_PORT}.` +
          '\n------------------------------------------------------------------\n'
      );
      if (process.send) process.send('ready');
    }
  });
} else {
  logger.error(
    '\n------------------------------------------------------------------\n' +
      '==> ❌  No PORT environment variable has been specified' +
      '\n------------------------------------------------------------------\n'
  );
}
export default app;
