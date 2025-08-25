export function GET(req, res) {
  req.session = null;
  return Response.json({ message: 'Logout' });
}
