import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '@mantine/hooks';

export default function Donate() {
  const [t] = useTranslation();

  useDocumentTitle(t('navbar.donate'));

  return (
    <iframe
      width='100%'
      height='100%'
      src='https://shop.minesquare.net/#shop'
      style={{ border: 0 }}
    />
  );
}
