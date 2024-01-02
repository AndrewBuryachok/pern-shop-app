import { Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core';
import {
  useFullscreen,
  useHotkeys,
  useLocalStorage,
  useToggle,
  useWindowEvent,
} from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import { useAppDispatch } from './app/hooks';
import { getCurrentUser } from './features/auth/auth.slice';
import { toggleCurrentLanguage } from './features/lang/lang.slice';
import {
  publishOffline,
  publishOnline,
  subscribe,
  toggleMute,
  unsubscribe,
} from './features/mqtt/mqtt.slice';
import CustomHeader from './common/components/CustomHeader';
import CustomNavbar from './common/components/CustomNavbar';
import CustomLoader from './common/components/CustomLoader';
import Protected from './common/components/Protected';
import CustomAffix from './common/components/CustomAffix';
import { pages } from './app/pages';

export default function App() {
  const dispatch = useAppDispatch();

  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      dispatch(publishOnline(user.id));
      dispatch(subscribe(user.id));
    }
  }, []);

  const handler = () => {
    if (user) {
      dispatch(publishOffline(user.id));
      dispatch(unsubscribe(user.id));
    }
  };

  useWindowEvent('beforeunload', handler);

  const preferredColorScheme = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches;

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'theme',
    defaultValue: preferredColorScheme ? 'dark' : 'light',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const { toggle: toggleFullscreen } = useFullscreen();

  useHotkeys([
    ['J', () => toggleColorScheme()],
    ['F', () => toggleFullscreen()],
    ['L', () => dispatch(toggleCurrentLanguage())],
    ['M', () => dispatch(toggleMute())],
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
                  width: '100%',
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
                              route.index || route.path === ':userId' ? (
                                <page.element />
                              ) : (
                                <Protected role={route.role}>
                                  <page.element />
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
            <CustomAffix />
          </NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
