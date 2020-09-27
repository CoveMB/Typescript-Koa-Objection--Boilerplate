import cors from '@koa/cors';
import { clientUrl } from 'config/variables';
import { Middleware } from 'koa';

export default cors({
  origin     : clientUrl as string,
  credentials: true
}) as Middleware;
