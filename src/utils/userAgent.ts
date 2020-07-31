import UserAgent from 'koa-useragent/dist/lib/useragent';

export const getDevice = ({ browser, os }: UserAgent): string => `${os || 'unknown'} - ${browser || 'unknown'}`;
