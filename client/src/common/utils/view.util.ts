import { t } from 'i18next';
import { SmUser } from '../../features/users/user.model';
import { MdThing } from '../../features/things/thing.model';
import { State } from '../../features/states/state.model';
import { parseItem } from './parse.util';

export const viewRoles = (roles: string[]) =>
  roles.map((role) => ({
    role,
    value: role,
    label: t(`constants.roles.${role}`),
    disabled: true,
  }));

export const viewUsers = (users: SmUser[]) =>
  users.map((user) => ({
    ...user,
    userid: user.id,
    nick: user.nick,
    value: `${user.id}`,
    label: user.nick,
    disabled: true,
  }));

export const viewThings = (things: MdThing[]) =>
  things.map((thing) => ({
    ...thing,
    value: `${thing.id}`,
    label: parseItem(thing.item),
    disabled: true,
  }));

export const viewStates = (states: State[]) =>
  states.map((state) => ({
    value: `${state.id}`,
    label: `${state.price} ${t('constants.currency')}`,
    price: state.price,
    date: state.createdAt,
    disabled: true,
  }));
