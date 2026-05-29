const https = require('https');

exports.handler = async function(event) {
  const TOGGL_HOST = 'api.track.toggl.com';

  // netlify.toml: /api/* → /.netlify/functions/toggl/:splat
  // So /api/v9/me becomes /.netlify/functions/toggl/v9/me
  // We need to send /api/v9/me to Toggl, so prepend /api to the splat
  const fnPrefix = '/.netlify/functions/toggl';
  let rest = event.path.startsWith(fnPrefix)
    ? event.path.slice(fnPrefix.length)
    : event.path;

  // rest is now e.g. /v9/me or /v9/workspaces/...
  // Toggl expects /api/v9/me
  let togglPath = '/api' + rest;
  if (event.rawQuery) togglPath += '?' + event.rawQuery;

  const authHeader = event.headers['authorization'] || event.headers['Authorization'];
  if (!authHeader) {
    return { statusCode: 401, body: JSON.stringify({ error: 'No Authorization header.' }) };
  }

  const data = await new Promise((resolve, reject) => {
    const options = {
      hostname: TOGGL_HOST,
      path: togglPath,
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'User-Agent': 'AYP-TimeTracker/1.0',
      },
    };
    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.end();
  });

  return {
    statusCode: data.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: data.body,
  };
};
