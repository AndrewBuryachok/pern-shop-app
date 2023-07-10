import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  MAX_AMOUNT_VALUE,
  MAX_COLOR_VALUE,
  MAX_COORDINATE_VALUE,
  MAX_DESCRIPTION_LENGTH,
  MAX_ID_VALUE,
  MAX_INTAKE_VALUE,
  MAX_KIT_VALUE,
  MAX_NAME_LENGTH,
  MAX_PRICE_VALUE,
  MAX_ROLE_VALUE,
  MAX_SUM_VALUE,
  MAX_ITEM_VALUE,
  MIN_COORDINATE_VALUE,
  MIN_NAME_LENGTH,
  MAX_RATE_VALUE,
} from '../constants';

export const IsName = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsString()(target, key);
  MinLength(MIN_NAME_LENGTH)(target, key);
  MaxLength(MAX_NAME_LENGTH)(target, key);
};

export const IsPassword = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsString()(target, key);
  MinLength(MIN_NAME_LENGTH)(target, key);
  MaxLength(MAX_NAME_LENGTH)(target, key);
};

export const IsDescription = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsString()(target, key);
  MaxLength(MAX_DESCRIPTION_LENGTH)(target, key);
};

export const IsId = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsInt()(target, key);
  IsPositive()(target, key);
  Max(MAX_ID_VALUE)(target, key);
};

export const IsSum = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsInt()(target, key);
  IsPositive()(target, key);
  Max(MAX_SUM_VALUE)(target, key);
};

export const IsCoordinate = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsInt()(target, key);
  Min(MIN_COORDINATE_VALUE)(target, key);
  Max(MAX_COORDINATE_VALUE)(target, key);
};

export const IsAmount = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsInt()(target, key);
  IsPositive()(target, key);
  Max(MAX_AMOUNT_VALUE)(target, key);
};

export const IsIntake = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsInt()(target, key);
  IsPositive()(target, key);
  Max(MAX_INTAKE_VALUE)(target, key);
};

export const IsPrice = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsInt()(target, key);
  IsPositive()(target, key);
  Max(MAX_PRICE_VALUE)(target, key);
};

export const IsRole = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsInt()(target, key);
  IsPositive()(target, key);
  Max(MAX_ROLE_VALUE)(target, key);
};

export const IsColor = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsInt()(target, key);
  IsPositive()(target, key);
  Max(MAX_COLOR_VALUE)(target, key);
};

export const IsItem = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsInt()(target, key);
  IsPositive()(target, key);
  Max(MAX_ITEM_VALUE)(target, key);
};

export const IsKit = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsInt()(target, key);
  IsPositive()(target, key);
  Max(MAX_KIT_VALUE)(target, key);
};

export const IsType = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsBoolean()(target, key);
};

export const IsRate = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsInt()(target, key);
  Min(0)(target, key);
  Max(MAX_RATE_VALUE)(target, key);
};
