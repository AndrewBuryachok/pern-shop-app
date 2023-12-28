import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '@mantine/hooks';

export default function Dynmap() {
  const [t] = useTranslation();

  useDocumentTitle(t('navbar.dynmap'));

  return (
    <iframe
      width='100%'
      height='100%'
      src={import.meta.env.VITE_MAP_URL}
      style={{ border: 0 }}
    />
  );
}
