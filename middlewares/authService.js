const jsonwebtoken = require('jsonwebtoken');

const secret = process.env.SECRET;
function generateToken(user) {
  return jsonwebtoken.sign(user, secret, {
    expiresIn: '1h',
  });
}

function verifyToken(token) {
  return jsonwebtoken.verify(token, secret);
}

function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader
      .split(' ')[1];
    if (token == null) {
      return res.sendStatus(401);
    }
    const verify = verifyToken(token)
    if (verify) {
      next()
      return
    }
    return res.sendStatus(401);
  } catch (error) {
    res.status(401).send(error)
  }
}


module.exports = { generateToken, authenticateToken };