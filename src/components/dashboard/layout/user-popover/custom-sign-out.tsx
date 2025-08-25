'use client';

import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';





export function CustomSignOut(): React.JSX.Element {
  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/sign-in';
  };

  return (
    <MenuItem component="div" onClick={handleSignOut} sx={{ justifyContent: 'center' }}>
      Sign out
    </MenuItem>
  );
}