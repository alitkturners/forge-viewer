const { authCallbackMiddleware } = require('../../../../services/aps.ts');

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const tokenCode = searchParams.get('code');
  const middleware = await authCallbackMiddleware(tokenCode);
  return Response.json(middleware);
}
