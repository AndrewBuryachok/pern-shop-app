import { ITableWithActions } from '../../common/interfaces';
import { Article } from './article.model';
import { getCurrentUser } from '../auth/auth.slice';
import {
  useSelectLikedArticlesQuery,
  useSelectViewedArticlesQuery,
} from './articles.api';
import CustomList from '../../common/components/CustomList';
import ArticlePaper from './ArticlePaper';

type Props = ITableWithActions<Article>;

export default function ArticlesList({ actions = [], ...props }: Props) {
  const user = getCurrentUser();

  const { data: viewedArticles, ...viewedArticlesResponse } =
    useSelectViewedArticlesQuery(undefined, { skip: !user });

  const { data: likedArticles, ...likedArticlesResponse } =
    useSelectLikedArticlesQuery(undefined, { skip: !user });

  return (
    <CustomList {...props}>
      {props.data?.result
        .map((article) => ({
          ...article,
          viewed: !!viewedArticles?.includes(article.id),
          upLiked: !!likedArticles?.up.includes(article.id),
          downLiked: !!likedArticles?.down.includes(article.id),
        }))
        .map((article) => (
          <ArticlePaper
            key={article.id}
            article={article}
            isViewedLoading={viewedArticlesResponse.isFetching}
            isLikedLoading={likedArticlesResponse.isFetching}
            actions={actions}
          />
        ))}
    </CustomList>
  );
}
