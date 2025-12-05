import { handleUserEvent } from '../users/users-events.handler';
import { handleMessageEvent } from '../messages/messages-events.handler';
import { handleCommentEvent } from '../articles/comments-events.handler';
import { handleLikeEvent } from '../articles/likes-events.handler';
import { handleViewEvent } from '../articles/views-events.handler';
import { Event } from '../../common/enums';

export const handleEvent = (page: Event, id: number, json: string) => {
  switch (page) {
    case Event.USERS:
      handleUserEvent(json);
      break;
    case Event.MESSAGES:
      handleMessageEvent(id, json);
      break;
    case Event.COMMENTS:
      handleCommentEvent(id, json);
      break;
    case Event.LIKES:
      handleLikeEvent(id, json);
      break;
    case Event.VIEWS:
      handleViewEvent(id, json);
      break;
    default:
      break;
  }
};
