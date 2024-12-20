import showdown from 'showdown';
import DOMPurify from 'dompurify';
import { TypographyStylesProvider } from '@mantine/core';

type Props = {
  text: string;
};

export default function CustomHighlight(props: Props) {
  const converter = new showdown.Converter({
    openLinksInNewWindow: true,
    simplifiedAutoLink: true,
    simpleLineBreaks: true,
    strikethrough: true,
    underline: true,
    tasklists: true,
    tables: true,
    emoji: true,
  });

  const text = props.text.replace(
    /@(\w+)/g,
    (match, nick) => `[${match}](/users/${nick})`,
  );

  const html = DOMPurify.sanitize(converter.makeHtml(text));

  return (
    <TypographyStylesProvider>
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ fontSize: 14, marginBottom: -20 }}
      />
    </TypographyStylesProvider>
  );
}
