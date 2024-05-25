import express from 'express';
import { createBareServer } from '@tomphttp/bare-server-node';
import { createServer } from 'node:http';
import path, { dirname } from 'node:path';
import createRammerhead from 'rammerhead/src/server/index.js';
import { fileURLToPath } from 'node:url';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';

const app = express();
const bare = createBareServer('/~/bare/');
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rammerhead = createRammerhead();

const rammerheadScopes = [
  '/rammerhead.js',
  '/hammerhead.js',
  '/transport-worker.js',
  '/task.js',
  '/iframe-task.js',
  '/worker-hammerhead.js',
  '/messaging',
  '/sessionexists',
  '/deletesession',
  '/newsession',
  '/editsession',
  '/needpassword',
  '/syncLocalStorage',
  '/api/shuffleDict',
  '/mainport'
];

const rammerheadSession = /^\/[a-z0-9]{32}/;

function shouldRouteRammerhead(req) {
    const url = new URL(req.url, 'http://0.0.0.0');
    return (
      rammerheadScopes.includes(url.pathname) ||
      rammerheadSession.test(url.pathname)
    );
}
  
function routeRammerheadRequest(req, res) {
    rammerhead.emit('request', req, res);
}
  
function routeRammerheadUpgrade(req, socket, head) {
    rammerhead.emit('upgrade', req, socket, head);
}

const serverFactory = (handler, opts) => {
    return createServer()
      .on('request', (req, res) => {
            if (bare.shouldRoute(req)) {
                bare.routeRequest(req, res);
            } else if (shouldRouteRammerhead(req)) {
                routeRammerheadRequest(req, res);
            } else {
                handler(req, res);
            }
      })
      .on('upgrade', (req, socket, head) => {
            if (bare.shouldRoute(req)) {
                bare.routeUpgrade(req, socket, head);
            } else if (shouldRouteRammerhead(req)) {
                routeRammerheadUpgrade(req, socket, head);
            }
      });
};

app.use(express.static(path.join(__dirname, 'public')));

app.use('/~/uv/', express.static(uvPath));

if (serverFactory) {
    serverFactory(app);
}