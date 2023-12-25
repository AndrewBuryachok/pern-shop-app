import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { FollowingsController } from './followings.controller';
import { FollowingsService } from './followings.service';

@Module({
  imports: [UsersModule],
  controllers: [FollowingsController],
  providers: [FollowingsService],
})
export class FollowingsModule {}
