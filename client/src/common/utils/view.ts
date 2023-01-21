import { SmUser } from '../../features/users/user.model';
import { SmCard } from '../../features/cards/card.model';
import { Container } from '../../features/containers/container.model';
import { SmThing } from '../../features/things/thing.model';
import { items, Role, roles as allRoles } from '../constants';

export const viewData = (data: string[]) => [`Total: ${data.length}`, ...data];

export const viewRoles = (roles: Role[]) =>
  viewData(roles.map((role) => allRoles[role - 1]));

export const viewUsers = (users: SmUser[]) =>
  viewData(users.map((user) => user.name));

export const viewCards = (cards: SmCard[]) =>
  viewData(cards.map((card) => card.name));

export const viewContainers = (containers: Container[]) =>
  viewData(containers.map((container) => `#${container.name}`));

export const viewThings = (things: SmThing[]) =>
  viewData(things.map((thing) => items[thing.item - 1].substring(3)));
