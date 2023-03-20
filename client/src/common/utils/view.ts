import { SmUser } from '../../features/users/user.model';
import { SmCard } from '../../features/cards/card.model';
import { Container } from '../../features/containers/container.model';
import { SmThing } from '../../features/things/thing.model';
import { items, Role, roles as allRoles } from '../constants';

export const viewData = (data: string[]) =>
  data.map((value) => ({ value, label: value, disabled: true }));

export const viewRoles = (roles: Role[]) =>
  viewData(!!roles.length ? roles.map((role) => allRoles[role - 1]) : ['User']);

export const viewUsers = (users: SmUser[]) =>
  users.map((user) => ({
    value: `${user.id}`,
    label: user.name,
    name: user.name,
    status: `${+user.status}`,
    disabled: true,
  }));

export const viewCards = (cards: SmCard[]) =>
  viewData(cards.map((card) => card.name));

export const viewContainers = (containers: Container[]) =>
  viewData(containers.map((container) => `#${container.name}`));

export const viewThings = (things: SmThing[]) =>
  things.map((thing) => ({
    value: `${thing.id}`,
    label: items[thing.item - 1].substring(3),
    item: thing.item,
    description: thing.description,
    disabled: true,
  }));
