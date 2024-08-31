import 'dotenv/config';

require('dotenv').config();

const config = {
  env: {
    doc: 'The application environment.',
    env: process.env.NEXT_PUBLIC_NODE_ENV ?? 'development'
  },
  NEXT_PUBLIC_HOST_BACK_END: {
    doc: 'Back end host name/IP',
    env: process.env.NEXT_PUBLIC_HOST_BACK_END ?? 'http://localhost:3001',
  },
  NEXT_PUBLIC_FRONT_BACK_END: {
    doc: 'Back end host name/IP',
    env: process.env.NEXT_PUBLIC_FRONT_BACK_END ?? 'http://localhost:3000',
  },
};

export { config };
