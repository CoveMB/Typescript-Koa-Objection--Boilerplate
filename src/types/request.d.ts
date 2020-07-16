type RequestWithUuid = {
  requestUuid: string
};

type WithValidatedRequest<M> = {
  validatedRequest: M
};

type WithRecords<M> = {
  records: M
};

type WithBody<M> = {
  request: {
    body: M
  }
};
