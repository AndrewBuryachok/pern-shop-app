import { Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core';
import {
  useDisclosure,
  useInterval,
  useLocalStorage,
  useMediaQuery,
  useWindowEvent,
} from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import { useAppDispatch } from './app/hooks';
import { getCurrentUser } from './features/auth/auth.slice';
import {
  publishOffline,
  publishOnline,
  subscribe,
  unsubscribe,
} from './features/mqtt/mqtt.slice';
import CustomHeader from './common/components/CustomHeader';
import CustomNavbar from './common/components/CustomNavbar';
import CustomAside from './common/components/CustomAside';
import CustomLoader from './common/components/CustomLoader';
import Protected from './common/components/Protected';
import { pages } from './app/pages';

export default function App() {
  const dispatch = useAppDispatch();

  const user = getCurrentUser();

  const interval = useInterval(() => dispatch(publishOnline(user!.id)), 900000);

  useEffect(() => {
    if (user) {
      interval.start();
    } else {
      interval.stop();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      interval.start();
      dispatch(publishOnline(user.id));
      dispatch(subscribe(user.id));
    }
  }, []);

  const handler = () => {
    if (user) {
      interval.stop();
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

  const matches = useMediaQuery('(min-width: 768px)');

  const [openedN, { toggle: toggleN, open: openN, close: closeN }] =
    useDisclosure(false);
  const [openedA, { toggle: toggleA, open: openA, close: closeA }] =
    useDisclosure(false);

  useEffect(() => {
    if (matches) {
      openN();
      openA();
    } else {
      closeN();
      closeA();
    }
  }, [matches]);

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
          <NotificationsProvider limit={1}>
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
              header={
                <CustomHeader
                  openedN={openedN}
                  openedA={openedA}
                  toggleN={toggleN}
                  toggleA={toggleA}
                />
              }
              navbar={
                <CustomNavbar
                  opened={openedN}
                  isMobile={!matches}
                  close={closeN}
                />
              }
              aside={<CustomAside opened={openedA} />}
            >
              <Suspense fallback={<CustomLoader />}>
                <Routes>
                  <Route index element={<Navigate to='/articles' replace />} />
                  {pages.map((page) =>
                    page.nested ? (
                      <Route key={page.path} path={page.path}>
                        {page.nested.map((route) => (
                          <Route
                            key={`${page.path} ${route.path}`}
                            {...route}
                            element={
                              route.index || route.path === 'top' ? (
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
                        key={page.path}
                        path={page.path}
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
