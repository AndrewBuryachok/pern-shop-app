import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../features/users/user.entity';
import { hashData } from '../../common/utils';

export default class TestSeed implements Seeder {
  public async run(factory: Factory) {
    await factory(User)()
      .map(async (user) => {
        user.nick = 'Admin';
        user.password = await hashData(user.nick);
        user.roles = [1];
        return user;
      })
      .create();
    await factory(User)()
      .map(async (user) => {
        user.nick = 'Banker';
        user.password = await hashData(user.nick);
        user.roles = [2];
        return user;
      })
      .create();
    await factory(User)()
      .map(async (user) => {
        user.nick = 'Manager';
        user.password = await hashData(user.nick);
        user.roles = [3];
        return user;
      })
      .create();
    await factory(User)()
      .map(async (user) => {
        user.nick = 'Judge';
        user.password = await hashData(user.nick);
        user.roles = [4];
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
