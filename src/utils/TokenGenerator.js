function TokenGenerator(request) {
  const token = request.headers.get('internal_token');
  const tokenObject = {
    access_token: token,
    expires_in: Date.now() + 50000,
    token_type: 'Bearer',
  };
  return tokenObject;
}

module.exports = TokenGenerator;
