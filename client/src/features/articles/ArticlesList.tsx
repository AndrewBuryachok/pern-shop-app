import { ITableWithActions } from '../../common/interfaces';
import { Article } from './article.model';
import { getCurrentUser } from '../auth/auth.slice';
import {
  useSelectLikedArticlesQuery,
  useSelectViewedArticlesQuery,
} from './articles.api';
import { useSelectMySubscribersQuery } from '../subscribers/subscribers.api';
import { useSelectMyIgnorersQuery } from '../ignorers/ignorers.api';
import CustomList from '../../common/components/CustomList';
import ArticlePaper from './ArticlePaper';

type Props = ITableWithActions<Article>;

export default function ArticlesList({ actions = [], ...props }: Props) {
  const user = getCurrentUser();

  const { data: subscribers, ...subscribersResponse } =
    useSelectMySubscribersQuery(undefined, { skip: !user });

  const { data: ignorers, ...ignorersResponse } = useSelectMyIgnorersQuery(
    undefined,
    { skip: !user },
  );

  const { data: viewedArticles, ...viewedArticlesResponse } =
    useSelectViewedArticlesQuery(undefined, { skip: !user });

  const { data: likedArticles, ...likedArticlesResponse } =
    useSelectLikedArticlesQuery(undefined, { skip: !user });

  return (
    <CustomList {...props}>
      {props.data?.result
        .filter(
          (article) =>
            !ignorers?.find((ignorer) => ignorer.id === article.user.id),
        )
        .map((article) => ({
          ...article,
          subscribed: !!subscribers?.find(
            (subscriber) => subscriber.id === article.user.id,
          ),
          viewed: !!viewedArticles?.includes(article.id),
          upLiked: likedArticles?.find(
            (likedArticle) =>
              likedArticle.id === article.id && likedArticle.like.type,
          ),
          downLiked: likedArticles?.find(
            (likedArticle) =>
              likedArticle.id === article.id && !likedArticle.like.type,
          ),
        }))
        .map((article) => (
          <ArticlePaper
            key={article.id}
            article={article}
            isSubscribersLoading={subscribersResponse.isFetching}
            isIgnorersLoading={ignorersResponse.isFetching}
            isViewedLoading={viewedArticlesResponse.isFetching}
            isLikedLoading={likedArticlesResponse.isFetching}
            actions={actions}
          />
        ))}
    </CustomList>
  );
}
