export type ReturnToken = {
  token: string,
  expiration: Date
};

export type EncodedJWTData = {
  id: number,
  uuid: string,
  admin: boolean
};
