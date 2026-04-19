import { defineEventHandler, setHeader, getMethod } from 'h3';

export default defineEventHandler((event) => {
  const origin = event.node.req.headers.origin || '*';

  setHeader(event, 'Access-Control-Allow-Origin', origin);
  setHeader(event, 'Access-Control-Allow-Credentials', 'true');
  setHeader(event, 'Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  setHeader(
    event,
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, Origin, Accept, Bypass-Tunnel-Reminder',
  );

  if (getMethod(event) === 'OPTIONS') {
    event.node.res.statusCode = 200;
    event.node.res.end();
  }
});