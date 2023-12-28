import { useTranslation } from 'react-i18next';
import { ActionIcon, Kbd, Menu, useMantineColorScheme } from '@mantine/core';
import { useFullscreen } from '@mantine/hooks';
import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconMoon,
  IconSettings,
  IconSun,
  IconVolume,
  IconVolumeOff,
  IconWorld,
} from '@tabler/icons';
import { useAppDispatch } from '../../app/hooks';
import { toggleCurrentLanguage } from '../../features/lang/lang.slice';
import { getMute, toggleMute } from '../../features/mqtt/mqtt.slice';

export default function SettingsMenu() {
  const [t] = useTranslation();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const { fullscreen, toggle: toggleFullscreen } = useFullscreen();
  const mute = getMute();

  const dispatch = useAppDispatch();

  return (
    <Menu offset={4} position='bottom-end' trigger='hover'>
      <Menu.Target>
        <ActionIcon size={32} variant='filled' color='pink'>
          <IconSettings size={24} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{t('header.menu.settings.title')}</Menu.Label>
        <Menu.Item
          icon={<IconWorld size={16} />}
          rightSection={<Kbd>L</Kbd>}
          onClick={() => dispatch(toggleCurrentLanguage())}
        >
          {t('header.menu.settings.language')}
        </Menu.Item>
        <Menu.Item
          icon={dark ? <IconSun size={16} /> : <IconMoon size={16} />}
          rightSection={<Kbd>J</Kbd>}
          onClick={() => toggleColorScheme()}
        >
          {dark
            ? t('header.menu.settings.theme.light')
            : t('header.menu.settings.theme.dark')}
        </Menu.Item>
        <Menu.Item
          icon={
            fullscreen ? (
              <IconArrowsMinimize size={16} />
            ) : (
              <IconArrowsMaximize size={16} />
            )
          }
          rightSection={<Kbd>F</Kbd>}
          onClick={() => toggleFullscreen()}
        >
          {fullscreen
            ? t('header.menu.settings.fullscreen.exit')
            : t('header.menu.settings.fullscreen.enter')}
        </Menu.Item>
        <Menu.Item
          icon={mute ? <IconVolume size={16} /> : <IconVolumeOff size={16} />}
          rightSection={<Kbd>M</Kbd>}
          onClick={() => dispatch(toggleMute())}
        >
          {mute
            ? t('header.menu.settings.mute.off')
            : t('header.menu.settings.mute.on')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
