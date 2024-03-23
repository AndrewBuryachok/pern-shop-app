import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Reply } from '../replies/reply.entity';
import { User } from '../users/user.entity';

@Entity('messages')
export class Message extends Reply {
  @Column({ name: 'chat_id' })
  chatId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'chat_id' })
  chat: User;

  @Column({ name: 'reply_id', nullable: true })
  replyId?: number;

  @ManyToOne(() => Message, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reply_id' })
  reply?: Message;
}
