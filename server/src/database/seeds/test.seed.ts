import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../features/users/user.entity';
import { hashData } from '../../common/utils';

export default class TestSeed implements Seeder {
  public async run(factory: Factory) {
    await factory(User)()
      .map(async (user) => {
        user.name = 'Admin';
        user.password = await hashData(user.name);
        user.roles = [1];
        return user;
      })
      .create();
    await factory(User)()
      .map(async (user) => {
        user.name = 'Banker';
        user.password = await hashData(user.name);
        user.roles = [2];
        return user;
      })
      .create();
    await factory(User)()
      .map(async (user) => {
        user.name = 'Manager';
        user.password = await hashData(user.name);
        user.roles = [3];
        return user;
      })
      .create();
    await factory(User)()
      .map(async (user) => {
        user.name = 'Judge';
        user.password = await hashData(user.name);
        user.roles = [4];
        return user;
      })
      .create();
    await factory(User)()
      .map(async (user) => {
        user.name = 'User';
        user.password = await hashData(user.name);
        user.roles = [];
        return user;
      })
      .create();
  }
}
