'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Script from 'next/script';
import { Box } from '@mui/material';

import { AuthGuard } from '@/components/auth/auth-guard';

const ModelView = dynamic(() => import('@/components/autodesk/ModelView'), { ssr: false });

export default function Page() {
  const [load, setLoad] = useState(false);
  return (
    <Box>
      <Head>
        <title>Spool Viewer</title>
      </Head>
      <Script
        src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.js"
        onLoad={() => setLoad(true)}
      />
      {load && <ModelView />}
    </Box>
  );
}
