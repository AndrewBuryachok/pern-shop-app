import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import {
  MAX_AMOUNT_VALUE,
  MAX_BACKGROUND_VALUE,
  MAX_COLOR_VALUE,
  MAX_COORDINATE_VALUE,
  MAX_DESCRIPTION_LENGTH,
  MAX_ID_VALUE,
  MAX_INTAKE_VALUE,
  MAX_ITEM_VALUE,
  MAX_KIND_VALUE,
  MAX_KIT_VALUE,
  MAX_LINK_LENGTH,
  MAX_NAME_LENGTH,
  MAX_NICK_LENGTH,
  MAX_PASSWORD_LENGTH,
  MAX_PRICE_VALUE,
  MAX_PRIORITY_VALUE,
  MAX_RATE_VALUE,
  MAX_RESULT_VALUE,
  MAX_ROLE_VALUE,
  MAX_SUM_VALUE,
  MAX_TEXT_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_COORDINATE_VALUE,
  MIN_NAME_LENGTH,
  MIN_NICK_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '../constants';

export const IsNick = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsString()(target, key);
  MinLength(MIN_NICK_LENGTH)(target, key);
  MaxLength(MAX_NICK_LENGTH)(target, key);
};

export const IsPassword = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsString()(target, key);
  MinLength(MIN_PASSWORD_LENGTH)(target, key);
  MaxLength(MAX_PASSWORD_LENGTH)(target, key);
};

export const IsDiscordOrAvatar = () => (target: object, key: string) => {
  ValidateIf((_, value) => value !== '')(target, key);
  IsNotEmpty()(target, key);
  IsString()(target, key);
  MinLength(MIN_NICK_LENGTH)(target, key);
  MaxLength(MAX_NICK_LENGTH)(target, key);
};

export const IsName = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsString()(target, key);
  MinLength(MIN_NAME_LENGTH)(target, key);
  MaxLength(MAX_NAME_LENGTH)(target, key);
};

export const IsTitle = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsString()(target, key);
  MaxLength(MAX_TITLE_LENGTH)(target, key);
};

export const IsDescription = () => (target: object, key: string) => {
  ValidateIf((_, value) => value !== '')(target, key);
  IsNotEmpty()(target, key);
  IsString()(target, key);
  MaxLength(MAX_DESCRIPTION_LENGTH)(target, key);
};

export const IsText = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsString()(target, key);
  MaxLength(MAX_TEXT_LENGTH)(target, key);
};

export const IsLink = () => (target: object, key: string) => {
  ValidateIf((_, value) => value !== '')(target, key);
  IsNotEmpty()(target, key);
  IsString()(target, key);
  IsUrl()(target, key);
  MaxLength(MAX_LINK_LENGTH)(target, key);
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

export const IsBackground = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsInt()(target, key);
  IsPositive()(target, key);
  Max(MAX_BACKGROUND_VALUE)(target, key);
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

export const IsKind = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsInt()(target, key);
  IsPositive()(target, key);
  Max(MAX_KIND_VALUE)(target, key);
};

export const IsPriority = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsInt()(target, key);
  IsPositive()(target, key);
  Max(MAX_PRIORITY_VALUE)(target, key);
};

export const IsResult = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsInt()(target, key);
  IsPositive()(target, key);
  Max(MAX_RESULT_VALUE)(target, key);
};

export const IsRate = () => (target: object, key: string) => {
  IsNotEmpty()(target, key);
  IsInt()(target, key);
  IsPositive()(target, key);
  Max(MAX_RATE_VALUE)(target, key);
};
