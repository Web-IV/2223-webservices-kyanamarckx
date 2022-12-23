module.exports = {
  port: 40043,
  log: {
    level: 'info',
    disabled: false,
  },
  cors: {
    origins: ['http://localhost:8000'],
    maxAge: 3 * 60 * 60,
  }
};
