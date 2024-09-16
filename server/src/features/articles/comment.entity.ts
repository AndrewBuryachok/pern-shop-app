import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Reply } from '../replies/reply.entity';
import { Article } from './article.entity';

@Entity('articles_comments')
export class ArticleComment extends Reply {
  @Column({ name: 'article_id' })
  articleId: number;

  @ManyToOne(() => Article, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @Column({ name: 'reply_id', nullable: true })
  replyId?: number;

  @ManyToOne(() => ArticleComment, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reply_id' })
  reply?: ArticleComment;
}
