import { MAX_PRICE_VALUE } from '../constants';

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
