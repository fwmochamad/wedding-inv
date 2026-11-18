import { GUESTS } from '../guests.js';
export default function handler(req, res) {
  const name = GUESTS[req.query.to];
  res.setHeader('cache-control', 'no-store');
  if (!name) return res.status(404).json({ error: 'not found' });
  res.status(200).json({ name });
}
