import { useLocation } from 'react-router-dom';
import ChatsList from './ChatsList';
import SingleChat from './SingleChat';

export default function ChatsPage() {
  const tab = useLocation().pathname.split('/')[2];

  return tab === 'my' ? <ChatsList /> : <SingleChat />;
}
