'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';



import type { NavItemConfig } from '@/types/nav';
import type { NavColor } from '@/types/settings';
import { paths } from '@/paths';
import { useSettings } from '@/hooks/use-settings';
import { Logo } from '@/components/core/logo';
import type { ColorScheme } from '@/styles/theme/types';



import { navColorStyles } from './styles';


const HubViewer = dynamic(() => import('@/app/hubs/components/HubView'), { ssr: false });

const logoColors = {
  dark: { blend_in: 'light', discrete: 'light', evident: 'light' },
  light: { blend_in: 'dark', discrete: 'dark', evident: 'light' },
} as Record<ColorScheme, Record<NavColor, 'dark' | 'light'>>;

export interface SideNavProps {
  color?: NavColor;
  items?: NavItemConfig[];
}

export function SideNav({ color = 'evident', items = [] }: SideNavProps): React.JSX.Element {
  const [isViewerAvailable, setIsViewerAvailable] = React.useState(false);

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkViewer = () => {
      if (typeof window !== 'undefined' && window.viewer) {
        setIsViewerAvailable(true);
        if (intervalId) {
          clearInterval(intervalId);
        }
      }
    };

    checkViewer();

    intervalId = setInterval(checkViewer, 500);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);
  const {
    settings: { colorScheme = 'light' },
  } = useSettings();

  const styles = navColorStyles[colorScheme][color];
  const logoColor = logoColors[colorScheme][color];

  return (
    <Box
      sx={{
        ...styles,
        bgcolor: 'var(--SideNav-background)',
        borderRight: 'var(--SideNav-border)',
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        left: 0,
        position: 'fixed',
        top: 0,
        width: 'var(--SideNav-width)',
        zIndex: 'var(--SideNav-zIndex)',
      }}
    >
      <Stack spacing={2} sx={{ p: 2 }}>
        <div>
          <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-flex' }}>
            <Logo color={logoColor} height={50} width={50} />
          </Box>
        </div>
      </Stack>
      <Box
        component="nav"
        sx={{
          flex: '1 1 auto',
          overflowY: 'auto',
          p: 2,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Stack component="li" spacing={2.5}>
          <div>
            <Typography sx={{ color: 'var(--NavGroup-title-color)', fontSize: '0.875rem', fontWeight: 500 }}>
              Hub Browser
            </Typography>
          </div>
        </Stack>
        {isViewerAvailable ? <HubViewer /> : null}
      </Box>
    </Box>
  );
}