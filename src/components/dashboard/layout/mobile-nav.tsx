import * as React from 'react';
import dynamic from 'next/dynamic';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';



import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { Logo } from '@/components/core/logo';





const HubViewer = dynamic(() => import('@/app/hubs/components/HubView'), { ssr: false });

export interface MobileNavProps {
  onClose?: () => void;
  open?: boolean;
  items?: NavItemConfig[];
}

export function MobileNav({ items = [], open, onClose }: MobileNavProps): React.JSX.Element {
  return (
    <Drawer
      PaperProps={{
        sx: {
          '--MobileNav-background': 'var(--mui-palette-neutral-950)',
          '--MobileNav-color': 'var(--mui-palette-common-white)',
          '--NavGroup-title-color': 'var(--mui-palette-neutral-400)',
          '--NavItem-color': 'var(--mui-palette-neutral-300)',
          '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
          '--NavItem-active-background': 'var(--mui-palette-primary-main)',
          '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
          '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
          '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
          '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
          '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
          '--NavItem-expand-color': 'var(--mui-palette-neutral-400)',
          '--NavItem-children-border': 'var(--mui-palette-neutral-700)',
          '--NavItem-children-indicator': 'var(--mui-palette-neutral-400)',
          '--Workspaces-background': 'var(--mui-palette-neutral-950)',
          '--Workspaces-border-color': 'var(--mui-palette-neutral-700)',
          '--Workspaces-title-color': 'var(--mui-palette-neutral-400)',
          '--Workspaces-name-color': 'var(--mui-palette-neutral-300)',
          '--Workspaces-expand-color': 'var(--mui-palette-neutral-400)',
          bgcolor: 'var(--MobileNav-background)',
          color: 'var(--MobileNav-color)',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '100%',
          width: 'var(--MobileNav-width)',
          zIndex: 'var(--MobileNav-zIndex)',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
      }}
      onClose={onClose}
      open={open}
    >
      <Stack spacing={2} sx={{ p: 2 }}>
        <div>
          <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-flex' }}>
            <Logo color="light" height={50} width={50} />
          </Box>
        </div>
      </Stack>
      <Box component="nav" sx={{ flex: '1 1 auto', p: 2 }}>
        <Stack component="li" spacing={2.5}>
          <div>
            <Typography sx={{ color: 'var(--NavGroup-title-color)', fontSize: '0.875rem', fontWeight: 500 }}>
              Hub Browser
            </Typography>
          </div>
        </Stack>
        <HubViewer />
      </Box>
    </Drawer>
  );
}