export type KnexConnectionConfig = {
  client: string,
  connection: {
    host: string,
    port: number,
    user: string,
    password: string,
    database: string,
  },
  pool?: {
    min: number, max: number,
  },
  searchPath: string[],
};
