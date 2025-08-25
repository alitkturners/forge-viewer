'use client';

import * as React from 'react';
import { Fragment, useEffect, useState } from 'react';
import { getAllModelProperties, getAllModelViews } from '@/redux/api';
import { toggleModalViewState, useDrawerState, useModelElementsOverlapCount, useUrn } from '@/redux/ModelViewslice';
import { getModelPropertiesCount } from '@/utils/modelProperties';
import { selectProperties } from '@/utils/selectProperties';
import { Icon } from '@iconify/react';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, GlobalStyles, IconButton, InputBase, ListItem, Paper, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import { DebounceInput } from 'react-debounce-input';
import { useDispatch } from 'react-redux';

import { drawerWidth } from '../ModelView';
import SpoolPropertiesListing from './SpoolPropertiesListing';

export default function ModelSideDrawer() {
  const [input, setInput] = useState<string>('');
  const [tab, setTab] = useState<string>('Current View');
  const urn = useUrn();
  const propertiesCount = getModelPropertiesCount(input);

  const handleReload = () => {
    selectProperties([]);
    setInput('');
  };

  const searchHandler = (e: any) => {
    e.preventDefault();
    setInput(e.target.value);
  };
  const dispatch = useDispatch();
  const open = useDrawerState();

  const toggleDrawer = () => {
    dispatch(toggleModalViewState());
  };

  useEffect(() => {
    if (urn) {
      // @ts-ignore
      dispatch(getAllModelViews({ urn }));
      // @ts-ignore
      dispatch(getAllModelProperties({ urn }));
    }
  }, [urn]);

  const list = () => (
    <Box sx={{ px: 2 }}>
      <List>
        <ListItem sx={{ my: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} disablePadding>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Spool (Assembly)
          </Typography>
          <Icon icon="iconamoon:close-bold" color="#9E9E9E" cursor="pointer" onClick={toggleDrawer} width={22} />
        </ListItem>
        <ListItem
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            my: 1,
          }}
          disablePadding
        >
          <Button
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              ':hover': {
                backgroundColor: 'transparent',
              },
            }}
            disableRipple
          >
            <Icon
              icon="solar:add-circle-bold"
              color="#21356C"
              cursor="pointer"
              width={18}
              style={{ marginRight: '5px' }}
            />
            <Typography variant="overline" sx={{ color: '#21356C', textTransform: 'none' }}>
              Add New Spool
            </Typography>
          </Button>
        </ListItem>
        <ListItem
          sx={{ width: '100%', backgroundColor: '#EEEEEE', borderRadius: '5px', overflow: 'hidden' }}
          disablePadding
        >
          {['Current View', 'All Spool']?.map((v: any) => (
            <Button
              sx={{
                width: '50%',
                borderRadius: '0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: tab === v ? '#21356C' : 'transparent',
                ':hover': {
                  backgroundColor: tab === v ? '#21356C' : 'transparent',
                },
              }}
              onClick={() => setTab(v)}
              disableRipple
            >
              <Typography
                variant="overline"
                sx={{
                  color: tab === v ? '#fff' : '#000000',
                  textTransform: 'none',
                }}
              >
                {v}
              </Typography>
            </Button>
          ))}
        </ListItem>
        <ListItem disablePadding sx={{ width: '100%', mt: 3 }}>
          <form onSubmit={searchHandler}>
            <Paper
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                borderRadius: 0,
                border: '1px solid #E7E7E7',
              }}
            >
              <DebounceInput
                element={InputBase}
                style={{ fontSize: '12px !important', fontWeight: 400 }}
                variant="soft"
                value={input}
                debounceTimeout={500}
                placeholder="Search Spool..."
                inputProps={{ 'aria-label': 'search.....' }}
                onChange={searchHandler}
              />
              <IconButton type="button" aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          </form>
        </ListItem>
        <ListItem
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5, mb: 3 }}
          disablePadding
        >
          <Typography variant="body2" sx={{ fontWeight: '600', color: '#A5A5A5' }}>
            Total {propertiesCount} spool found
          </Typography>
          <Typography
            variant="overline"
            onClick={handleReload}
            sx={{
              color: '#21356C',
              textTransform: 'none',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <Icon icon="uiw:reload" color="#21356C" style={{ marginRight: '3px', width: '16px' }} />
            Reload
          </Typography>
        </ListItem>
        <ListItem disablePadding>
          <SpoolPropertiesListing search={input} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box>
      <GlobalStyles
        styles={{
          '.MuiDrawer-paperAnchorRight': {
            minWidth: '320px',
          },
          '::placeholder': {
            fontSize: '12px !important',
            color: '#9F9F9F !important',
          },
        }}
      />
      <Fragment key="right">
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
            },
          }}
          variant="persistent"
          anchor="right"
          open={open}
        >
          {list()}
        </Drawer>
      </Fragment>
    </Box>
  );
}
