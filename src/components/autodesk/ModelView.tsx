'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { initViewer, loadModel } from '@/app/viewer';
import { getModelsList, SelectOption } from '@/redux/api';
import { updateUrn, useDrawerState, useModelsList, useUrn } from '@/redux/ModelViewslice';
import { Box, Button, GlobalStyles, MenuItem, Select, styled, Typography } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

const ModelSideDrawer = dynamic(() => import('./components/ModelSideDrawer'), { ssr: false });

export const drawerWidth = 280;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const Main = styled('main', { shouldForwardProp: (prop: any) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  transition: `${theme.transitions.duration.enteringScreen}ms ${theme.transitions.easing.easeInOut}`,

  marginRight: drawerWidth,
  ...(open && {
    width: `calc(100% - ${drawerWidth + 30}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    '#preview': {
      transition: `${theme.transitions.duration.enteringScreen}ms ${theme.transitions.easing.easeInOut}`,
      right: '20em',
    },
    '#guiviewer3d-toolbar': {
      left: '200px',
    },
    marginRight: drawerWidth + 40,
  }),
}));
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth + 40}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),

    marginRight: drawerWidth + 40,
  }),
}));

function ModelView() {
  const [loaded, setLoaded] = useState(true);
  const { data } = useModelsList();
  const dispatch = useDispatch();

  const open = useDrawerState();
  const urn = useUrn();

  const inputStyle = {
    display: 'none',
  };

  const [viewer, setViewer] = useState<unknown>();

  const initialViewer = async () => {
    const rep = await initViewer(document.getElementById('preview'), document.getElementById('2d'));
    window.viewer = rep;
    setViewer(rep);
  };
  useEffect(() => {
    void initialViewer();
    // @ts-ignore
    dispatch(getModelsList());
  }, []);
  const urnChange = async (value: string) => {
    dispatch(updateUrn(value));
    try {
      const resp = await fetch(`/api/models/${value}`);

      if (!resp.ok) {
        throw new Error(await resp.text());
      }
      const status = await resp.json();
      switch (status?.status) {
        case 'n/a':
          toast.success(`Model has not been translated.`);
          break;
        case 'inprogress':
          toast.success(`Model is being translated (${status?.progress})...`);
          break;
        case 'failed':
          toast.error(
            `Translation failed. <ul>${status.messages.map((msg: any) => `<li>${JSON.stringify(msg)}</li>`).join('')}</ul>`
          );
          break;
        default:
          await loadModel(viewer, value, value);

          break;
      }
    } catch (err) {
      toast.error('Could not load model. See the console for more details.');
    }
  };

  useEffect(() => {
    if (data?.length > 0) {
      // @ts-ignore
      dispatch(updateUrn(data?.[0]?.value));
    }
  }, [data?.length]);

  useEffect(() => {
    if (urn && loaded && viewer) {
      void urnChange(urn);
      setLoaded(false);
    }
  }, [urn, viewer]);

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <GlobalStyles
        styles={{
          '[data-sonner-toast][data-swiping=false][data-removed=true]:before': {
            content: 'none',
            position: 'relative !important',
          },
          '[data-sonner-toast]:after': {
            content: 'none',
            position: 'relative !important',
          },
        }}
      />
      <AppBar position="fixed" open={open}>
        <Box id="header">
          <img alt="Autodesk Platform Services" className="logo" src="https://cdn.autodesk.io/logo/black/stacked.png" />
          <Typography className="title" variant="caption">
            Simple Viewer
          </Typography>
          <Button
            color="secondary"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/auth/sign-in';
            }}
            variant="outlined"
          >
            Logout
          </Button>
          <Select
            id="models"
            name="models"
            value={urn}
            // TODO Create dispatch Function to change the URN
            onChange={(e: any) => urnChange(e.target.value)}
            sx={{
              flex: '0 1 auto',
              minWidth: '2em',
            }}
          >
            {data?.map((i: SelectOption) => (
              <MenuItem key={i?.value} value={i?.value}>
                {i?.label}
              </MenuItem>
            ))}
          </Select>
          <button id="upload" title="Upload New Model" type="button">
            Upload
          </button>
          <input id="input" style={inputStyle} type="file" />
        </Box>
      </AppBar>
      <Main open={open}>
        <Box width="50%" id="preview" />
        <Box id="2d" width="50%" />
      </Main>
      <ModelSideDrawer />
    </Box>
  );
}

export default ModelView;
