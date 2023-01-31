import { VercelRequest, VercelResponse } from '@vercel/node';
import { hammerheadDashboardLogin, hammerheadSync } from '../lib/hammerhead';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = JSON.parse(req.body);

  console.log(req.body, username, password)

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  const auth = await hammerheadDashboardLogin(username, password);
  const sync = await hammerheadSync(auth);

  return res.json(sync);
}
