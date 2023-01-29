import { hammerheadDashboardLogin, hammerheadSync } from './lib/hammerhead.js';

try {
  console.log('Login to Hammerhead Dashboard...');

  const hammerheadAuthorization = await hammerheadDashboardLogin(
    process.env.HAMMERHEAD_USERNAME,
    process.env.HAMMERHEAD_PASSWORD
  );

  console.log('Sync Hammerhead Routes...');

  await hammerheadSync(hammerheadAuthorization);
} catch (e) {
  console.log(e);
  throw e;
}
