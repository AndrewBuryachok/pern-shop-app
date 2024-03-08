import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { View } from '../views/view.entity';
import { Article } from './article.entity';

@Entity('articles_views')
export class ArticleView extends View {
  @Column({ name: 'article_id' })
  articleId: number;

  @ManyToOne(() => Article, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article: Article;
}
