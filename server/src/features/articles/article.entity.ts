import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ArticleView } from './article-view.entity';
import { ArticleLike } from './article-like.entity';
import { ArticleComment } from './comment.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  text: string;

  @Column({ type: 'text', array: true, default: [] })
  images: string[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => ArticleView, (view) => view.article)
  views: ArticleView[];

  @OneToMany(() => ArticleLike, (like) => like.article)
  likes: ArticleLike[];

  @OneToMany(() => ArticleComment, (comment) => comment.article)
  comments: ArticleComment[];
}
