'use client';

import React, { useEffect } from 'react';
import { initViewer } from '@/app/viewer';
import { Box } from '@mui/material';

function Viewer() {
  const initialViewer = async () => {
    const rep = await initViewer(document.getElementById('preview'), document.getElementById('2d'));
    window.viewer = rep;
  };

  useEffect(() => {
    void initialViewer();
  }, []);
  return (
    <Box>
      <Box sx={{ width: { lg: '50% !important' } }} id="preview" />
      <Box sx={{ width: { lg: '50% !important' } }} id="2d" />
    </Box>
  );
}

export default Viewer;
