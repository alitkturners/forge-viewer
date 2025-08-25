const { getAuthorizationUrl } = require('../../../../services/aps.ts');

export function GET() {
  return Response.redirect(getAuthorizationUrl());
}
