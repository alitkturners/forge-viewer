'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Script from 'next/script';



import { AuthGuard } from '@/components/auth/auth-guard';





const Viewer = dynamic(() => import('@/app/hubs/components/Viewer'), { ssr: false });

function Page() {
  const [load, setLoad] = useState(false);
  return (
    <AuthGuard>
      <>
        <Script
          src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.js"
          onLoad={() => setLoad(true)}
        />
        {load && <Viewer />}
      </>
    </AuthGuard>
  );
}

export default Page;