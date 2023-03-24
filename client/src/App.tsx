import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core';
import {
  useColorScheme,
  useFullscreen,
  useHotkeys,
  useLocalStorage,
  useToggle,
} from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import CustomHeader from './common/components/CustomHeader';
import CustomNavbar from './common/components/CustomNavbar';
import CustomLoader from './common/components/CustomLoader';
import Protected from './common/components/Protected';
import { pages } from './app/pages';

export default function App() {
  const preferredColorScheme = useColorScheme();

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'theme',
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const { toggle: toggleFullscreen } = useFullscreen();

  useHotkeys([
    ['J', () => toggleColorScheme()],
    ['F', () => toggleFullscreen()],
  ]);

  const [opened, toggle] = useToggle();

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, primaryColor: 'violet' }}
        withGlobalStyles
        withNormalizeCSS
      >
        <ModalsProvider>
          <NotificationsProvider>
            <AppShell
              styles={(theme) => ({
                main: {
                  backgroundColor:
                    theme.colorScheme === 'dark'
                      ? theme.colors.dark[8]
                      : theme.colors.gray[0],
                },
              })}
              navbarOffsetBreakpoint='sm'
              navbar={<CustomNavbar opened={opened} />}
              header={<CustomHeader opened={opened} toggle={toggle} />}
            >
              <Suspense fallback={<CustomLoader />}>
                <Routes>
                  {pages.map((page) =>
                    page.nested ? (
                      <Route key={page.path} path={page.path}>
                        {page.nested.map((route) => (
                          <Route
                            key={`${page.path} ${route.path}`}
                            {...route}
                            element={
                              (route.index && page.path !== 'polls') ||
                              (route.path && route.path === ':userId') ? (
                                <route.element />
                              ) : (
                                <Protected role={route.role}>
                                  <route.element />
                                </Protected>
                              )
                            }
                          />
                        ))}
                      </Route>
                    ) : (
                      <Route
                        key={page.path || 'home'}
                        {...page}
                        element={<page.element />}
                      />
                    ),
                  )}
                </Routes>
              </Suspense>
            </AppShell>
          </NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
