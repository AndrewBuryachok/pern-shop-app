import showdown from 'showdown';
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
    ghMentions: true,
    ghMentionsLink: '/users/{u}',
  });

  return (
    <TypographyStylesProvider>
      <div
        dangerouslySetInnerHTML={{
          __html: converter.makeHtml(props.text),
        }}
        style={{ fontSize: 14, marginBottom: -20 }}
      />
    </TypographyStylesProvider>
  );
}
