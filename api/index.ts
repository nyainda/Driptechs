import { createServer } from '../server/index.js';

let app: any = null;

export default async function handler(req: any, res: any) {
  if (!app) {
    app = await createServer();
  }
  return app(req, res);
}