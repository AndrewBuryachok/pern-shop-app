import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Reaction } from '../reactions/reaction.entity';
import { Article } from './article.entity';

@Entity('likes')
export class Like extends Reaction {
  @Column({ name: 'article_id' })
  articleId: number;

  @ManyToOne(() => Article, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article: Article;
}
