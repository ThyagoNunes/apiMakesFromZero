const http = require('http');
const { URL } = require('url');

const routes = require('./routes');
const bodyParser = require('./helpers/bodyParser');

const app = http.createServer((request, response) => {
  const parsedUrl = new URL(`http://localhost:3000${request.url}`);

  console.log(parsedUrl);
  let { pathname } = parsedUrl;

  const spliEndPoint = pathname.split('/').filter(Boolean);
  let id = null;

  if (spliEndPoint.length > 1) {
    pathname = `/${spliEndPoint[0]}/:id`;
    id = spliEndPoint[1];
  }

  const route = routes.find((routeObj) => (
    routeObj.endpoint === pathname && routeObj.method === request.method
  ));

  if (route) {
    request.params = { id };
    request.query = Object.fromEntries(parsedUrl.searchParams);
    response.send = (statusCode, body) => {
      response.writeHead(statusCode, { 'Content-type': 'Application/json' });
      response.end(JSON.stringify(body));
    };

    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      bodyParser(request, () => route.handler(request, response));
    } else {
      route.handler(request, response);
    }
  } else {
    response.writeHead(400, { 'Content-type': 'text/html' });
    response.end(`Cannot ${request.method} ${pathname}`);
  }
});

app.listen(3000, () => console.log('🔥 Server started at: http://localhost:3000'));
