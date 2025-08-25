const { getHubs } = require('../../../services/aps.ts');
const tokenGenerator = require('../../../utils/TokenGenerator.js');

export async function GET(req, res) {
  const token = tokenGenerator(req);

  try {
    const hubs = await getHubs(token);
    return Response.json(hubs);
  } catch (err) {
    console.log(err);
    return Response.json({
      err,
    });
  }
}
