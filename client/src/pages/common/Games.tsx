import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useDocumentTitle } from '@mantine/hooks';

export default function Games() {
  const [t] = useTranslation();

  const tab = useLocation().pathname.split('/')[1];

  useDocumentTitle(t(`navbar.${tab}`));

  return (
    <iframe
      width='100%'
      height='100%'
      src={
        {
          snake: 'https://snakes-game-nine.vercel.app',
          minesweeper: 'https://laoqiu233.github.io/minesweeper-react',
          lightsout: 'https://luciatruden.github.io/lights-out',
          memory: 'https://fantasy-memory-game.netlify.app',
          2048: 'https://monicatvera.github.io/2048',
        }[tab]
      }
      style={{ border: 0 }}
    />
  );
}
