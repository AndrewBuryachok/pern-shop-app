export * from './query';
export * from './parse';
export * from './view';
export * from './select';

export const customMin = (required: number, optional?: number) =>
  optional === undefined ? required : Math.min(required, optional);
