const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('auth-token');
  // Check if token exist
  
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user from payload
    // console.log(decoded.user.id,"decoded data")
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = auth;