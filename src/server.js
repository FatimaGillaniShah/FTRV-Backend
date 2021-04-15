import debugObj from 'debug';
import http from 'http';
import app from './app';
import models from './models';

const debug = debugObj('api:server');
const port = normalizePort(process.env.PORT || '3000');
const address = process.env.SERVER_ADDRESS || '0.0.0.0';
const server = http.createServer(app);
init();

async function init() {
  await models.sequelize.sync();
  // eslint-disable-next-line no-console
  server.listen(port, address, () => console.log(`Server running on http://${address}:${port}`));
  server.on('error', onError);
  server.on('listening', onListening);
}
function normalizePort(val) {
  // eslint-disable-next-line no-shadow
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      // eslint-disable-next-line no-console
      console.error(`${bind} imports elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      // eslint-disable-next-line no-console
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}
