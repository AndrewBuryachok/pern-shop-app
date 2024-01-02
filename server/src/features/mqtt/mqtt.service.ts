import { MqttClient, connect } from 'mqtt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MqttService {
  private client: MqttClient;

  constructor() {
    this.client = connect(process.env.BROKER_URL);
  }

  publishNotificationMessage(id: number, message: string): void {
    this.publishMessage('notifications/' + id, message);
  }

  private publishMessage(topic: string, message: string): void {
    this.client.publish(process.env.BROKER_TOPIC + topic, message);
  }
}
