import tokenGenerator from '../../../../../utils/TokenGenerator.js';

const { getProjects } = require('../../../../../services/aps.ts');

export async function GET(req, { params }) {
  const token = tokenGenerator(req);
  const hub_id = params.hub_id;

  try {
    const projects = await getProjects(hub_id, token);
    return Response.json(projects);
  } catch (err) {
    console.log(err);
    return Response.json({
      err,
    });
  }
}
