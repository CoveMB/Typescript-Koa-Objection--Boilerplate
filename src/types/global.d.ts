export interface Constructable<M> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // We want this Constructable to be flexible so we will accept any here
  new(...opt: any[]): M;
}
