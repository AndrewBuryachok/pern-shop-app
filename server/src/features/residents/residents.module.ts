import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    TypeOrmModule.forFeature([Invitation, Application]),
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
