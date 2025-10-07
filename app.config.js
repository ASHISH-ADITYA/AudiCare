const fs = require('fs');
const path = require('path');

// Load .env if present (local development only)
try {
  const dotenvPath = path.resolve(__dirname, '.env');
  if (fs.existsSync(dotenvPath)) {
    require('dotenv').config({ path: dotenvPath });
  }
} catch (e) {
  // ignore
}

module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      GIMIN_API_KEY: process.env.GIMIN_API_KEY || '',
    },
  };
};
