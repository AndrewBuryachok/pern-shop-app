import { ITableWithActions } from '../../common/interfaces';
import { Article } from './article.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useSelectAuthArticlesQuery } from './articles.api';
import CustomList from '../../common/components/CustomList';
import ArticlePaper from './ArticlePaper';

type Props = ITableWithActions<Article>;

export default function ArticlesList({ actions = [], ...props }: Props) {
  const user = getCurrentUser();

  const { data: authArticles, ...authArticlesResponse } =
    useSelectAuthArticlesQuery(undefined, { skip: !user });

  return (
    <CustomList {...props}>
      {props.data?.result
        .map((article) => ({
          ...article,
          viewed: !!authArticles?.view.includes(article.id),
          upLiked: !!authArticles?.up.includes(article.id),
          downLiked: !!authArticles?.down.includes(article.id),
        }))
        .map((article) => (
          <ArticlePaper
            key={article.id}
            article={article}
            isLoading={authArticlesResponse.isFetching}
            actions={actions}
          />
        ))}
    </CustomList>
  );
}
