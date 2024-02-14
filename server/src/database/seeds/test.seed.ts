import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../features/users/user.entity';
import { Role } from '../../features/users/role.enum';
import { hashData } from '../../common/utils';

export default class TestSeed implements Seeder {
  public async run(factory: Factory) {
    await factory(User)()
      .map(async (user) => {
        user.nick = 'Admin';
        user.password = await hashData(user.nick);
        user.roles = [Role.ADMIN];
        return user;
      })
      .create();
    await factory(User)()
      .map(async (user) => {
        user.nick = 'Banker';
        user.password = await hashData(user.nick);
        user.roles = [Role.BANKER];
        return user;
      })
      .create();
    await factory(User)()
      .map(async (user) => {
        user.nick = 'Manager';
        user.password = await hashData(user.nick);
        user.roles = [Role.MANAGER];
        return user;
      })
      .create();
    await factory(User)()
      .map(async (user) => {
        user.nick = 'Judge';
        user.password = await hashData(user.nick);
        user.roles = [Role.JUDGE];
        return user;
      })
      .create();
    await factory(User)()
      .map(async (user) => {
        user.nick = 'HubHead';
        user.password = await hashData(user.nick);
        user.roles = [Role.HUB];
        return user;
      })
      .create();
    await factory(User)()
      .map(async (user) => {
        user.nick = 'SpawnHead';
        user.password = await hashData(user.nick);
        user.roles = [Role.SPAWN];
        return user;
      })
      .create();
    await factory(User)()
      .map(async (user) => {
        user.nick = 'EndHead';
        user.password = await hashData(user.nick);
        user.roles = [Role.END];
        return user;
      })
      .create();
    await factory(User)()
      .map(async (user) => {
        user.nick = 'User';
        user.password = await hashData(user.nick);
        user.roles = [];
        return user;
      })
      .create();
  }
}
