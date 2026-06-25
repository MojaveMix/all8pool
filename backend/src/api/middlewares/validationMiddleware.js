const validator = require('validator');

const validateRegister = (req, res, next) => {
  let { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || validator.isEmpty(name.trim())) {
    return res.status(400).json({ message: 'Name is required' });
  }

  if (!email || typeof email !== 'string' || !validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  // Sanitize name and email
  req.body.name = validator.escape(name.trim());
  req.body.email = validator.normalizeEmail(email.trim());

  next();
};

const validateLogin = (req, res, next) => {
  let { email, password } = req.body;

  if (!email || typeof email !== 'string' || !validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  if (!password || typeof password !== 'string' || validator.isEmpty(password)) {
    return res.status(400).json({ message: 'Password is required' });
  }

  req.body.email = validator.normalizeEmail(email.trim());

  next();
};

const validateUUID = (paramName = 'id') => {
  return (req, res, next) => {
    const value = req.params[paramName];
    if (value && !validator.isUUID(value)) {
      return res.status(400).json({ message: 'Invalid identifier format' });
    }
    next();
  };
};

module.exports = {
  validateRegister,
  validateLogin,
  validateUUID
};
