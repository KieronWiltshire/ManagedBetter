export default {
  name: process.env.APP_NAME || 'ManagedBetter',
  domain: (process.env.APP_DOMAIN || 'localhost').replace(/\/$/, ''),
  port: parseInt(process.env.APP_PORT || '3001', 10) || 3000,
  environment: process.env.NODE_ENV || 'local',
  debug: ['local', 'development', 'test'].includes(process.env.NODE_ENV?.toLowerCase()),
};