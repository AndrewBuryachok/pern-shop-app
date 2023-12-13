import { MAX_PRICE_VALUE, MAX_SUM_VALUE } from '../constants';

export const scaleSum = (v: number) => (v < 1000 ? v : 29 * v - 28000);

export const unscaleSum = (v: number) => (v < 1000 ? v : (v + 28000) / 29);

export const scaleMinSum = (v: number | undefined) => {
  if (v === undefined) return v;
  const res = scaleSum(v);
  return res === 1 ? null : res;
};

export const scaleMaxSum = (v: number | undefined) => {
  if (v === undefined) return v;
  const res = scaleSum(v);
  return res === MAX_SUM_VALUE ? null : res;
};

export const unscaleMinSum = (v: number | null | undefined) => {
  if (v === undefined) return v;
  return unscaleSum(v === null ? 1 : v);
};

export const unscaleMaxSum = (v: number | null | undefined) => {
  if (v === undefined) return v;
  return unscaleSum(v === null ? MAX_SUM_VALUE : v);
};

export const scaleMinSearch = (v: number | undefined) => {
  if (v === undefined) return v;
  return v === 1 ? null : v;
};

export const scaleMaxSearch = (v: number | undefined, max: number) => {
  if (v === undefined) return v;
  return v === max ? null : v;
};

export const unscaleMinSearch = (v: number | null | undefined) => {
  if (v === undefined) return v;
  return v === null ? 1 : v;
};

export const unscaleMaxSearch = (v: number | null | undefined, max: number) => {
  if (v === undefined) return v;
  return v === null ? max : v;
};

export const scalePrice = (v: number) => (v < 100 ? v : 9 * v - 800);

export const unscalePrice = (v: number) => (v < 100 ? v : (v + 800) / 9);

export const scaleMinPrice = (v: number | undefined) => {
  if (v === undefined) return v;
  const res = scalePrice(v);
  return res === 1 ? null : res;
};

export const scaleMaxPrice = (v: number | undefined) => {
  if (v === undefined) return v;
  const res = scalePrice(v);
  return res === MAX_PRICE_VALUE ? null : res;
};

export const unscaleMinPrice = (v: number | null | undefined) => {
  if (v === undefined) return v;
  return unscalePrice(v === null ? 1 : v);
};

export const unscaleMaxPrice = (v: number | null | undefined) => {
  if (v === undefined) return v;
  return unscalePrice(v === null ? MAX_PRICE_VALUE : v);
};

export const scaleDate = (date: Date | '' | null | undefined) =>
  date &&
  new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

export const unscaleDate = (date: string | null | undefined) =>
  date && new Date(new Date(date).toISOString().slice(0, -1));
