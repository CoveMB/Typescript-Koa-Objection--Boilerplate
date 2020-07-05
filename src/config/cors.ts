import { clientUrl } from './variables';

const corsOptions: Record<string, string> = {
  'Access-Control-Allow-Origin': clientUrl
};

export default corsOptions;
