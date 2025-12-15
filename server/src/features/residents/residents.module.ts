import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database } from '../../database.enum';
import { Invitation } from './invitation.entity';
import { Application } from './application.entity';
import { UsersModule } from '../users/users.module';
import { TownsModule } from '../towns/towns.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { ResidentsController } from './residents.controller';
import { InvitationsController } from './invitations.controller';
import { ApplicationsController } from './applications.controller';
import { ResidentsService } from './residents.service';

@Module({
  imports: [
    ...Object.values(Database).map((db) =>
      TypeOrmModule.forFeature([Invitation, Application], db),
    ),
    UsersModule,
    TownsModule,
    MqttModule,
  ],
  controllers: [
    ResidentsController,
    InvitationsController,
    ApplicationsController,
  ],
  providers: [ResidentsService],
})
export class ResidentsModule {}
