import { t } from 'i18next';
import { SmUser } from '../../features/users/user.model';
import { SmCard } from '../../features/cards/card.model';
import { Container } from '../../features/containers/container.model';
import { SmThing } from '../../features/things/thing.model';
import { State } from '../../features/states/state.model';
import { Role, roles as allRoles } from '../constants';
import { parseItem } from './parse';

export const viewRoles = (roles: Role[]) =>
  roles.map((role) => ({
    text: t('constants.roles.' + allRoles[role - 1]),
    color: `${role}`,
    value: `${role}`,
    label: t('constants.roles.' + allRoles[role - 1]),
    disabled: true,
  }));

export const viewUsers = (users: SmUser[]) =>
  users.map((user) => ({
    ...user,
    status: +user.status,
    value: `${user.id}`,
    label: user.name,
    disabled: true,
  }));

export const viewCards = (cards: SmCard[]) =>
  cards.map((card) => ({
    ...card,
    color: `${card.color}`,
    value: `${card.id}`,
    label: card.name,
    disabled: true,
  }));

export const viewContainers = (containers: Container[]) =>
  containers.map((container) => ({
    value: `${container.id}`,
    label: `#${container.name}`,
    disabled: true,
  }));

export const viewThings = (things: SmThing[]) =>
  things.map((thing) => ({
    ...thing,
    value: `${thing.id}`,
    label: parseItem(thing.item),
    disabled: true,
  }));

export const viewStates = (states: State[]) =>
  states.map((state) => ({
    value: `${state.id}`,
    label: `${state.price}$`,
    price: state.price,
    date: state.createdAt,
    disabled: true,
  }));
