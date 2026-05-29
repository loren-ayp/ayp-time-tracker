const https = require('https');

exports.handler = async function(event) {
  const TOGGL_HOST = 'api.track.toggl.com';

  const authHeader = event.headers['authorization'] || event.headers['Authorization'];
  if (!authHeader) {
    return { statusCode: 401, body: JSON.stringify({ error: 'No Authorization header.' }) };
  }

  // event.path from Netlify redirect will be /.netlify/functions/toggl/v9/me
  // We need to send /api/v9/me to Toggl
  const fnPrefix = '/.netlify/functions/toggl';
  let rest = event.path.startsWith(fnPrefix)
    ? event.path.slice(fnPrefix.length)
    : event.path;

  let togglPath = rest.startsWith('/api') ? rest : '/api' + rest;
  if (event.rawQuery) togglPath += '?' + event.rawQuery;

  const data = await new Promise((resolve, reject) => {
    const req = https.request({
      hostname: TOGGL_HOST,
      path: togglPath,
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'User-Agent': 'AYP-TimeTracker/1.0',
      },
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.end();
  });

  return {
    statusCode: data.status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: data.body,
  };
};
