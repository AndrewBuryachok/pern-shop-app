import { handleUserEvent } from '../users/users-events.handler';
import { handleMessageEvent } from '../messages/messages-events.handler';
import { handleArticleCommentEvent } from '../articles/comments-events.handler';
import { handleArticleLikeEvent } from '../articles/likes-events.handler';
import { handleArticleViewEvent } from '../articles/views-events.handler';
import { handlePollCommentEvent } from '../polls/comments-events.handler';
import { handlePollLikeEvent } from '../polls/likes-events.handler';
import { handlePollViewEvent } from '../polls/views-events.handler';
import { Event } from '../../common/enums';

export const handleEvent = (page: Event, id: number, json: string) => {
  switch (page) {
    case Event.USERS:
      handleUserEvent(json);
      break;
    case Event.MESSAGES:
      handleMessageEvent(id, json);
      break;
    case Event.ARTICLES_COMMENTS:
      handleArticleCommentEvent(id, json);
      break;
    case Event.ARTICLES_LIKES:
      handleArticleLikeEvent(id, json);
      break;
    case Event.ARTICLES_VIEWS:
      handleArticleViewEvent(id, json);
      break;
    case Event.POLLS_COMMENTS:
      handlePollCommentEvent(id, json);
      break;
    case Event.POLLS_LIKES:
      handlePollLikeEvent(id, json);
      break;
    case Event.POLLS_VIEWS:
      handlePollViewEvent(id, json);
      break;
    default:
      break;
  }
};
