'use client';

import * as React from 'react';
import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

interface OAuthProvider {
  id: 'autodesk';
  name: string;
  logo: string;
}
const oAuthProviders = [
  { id: 'autodesk', name: 'Autodesk Platform Services', logo: '/assets/APS.png' },
] satisfies OAuthProvider[];

export function SignInForm(): React.JSX.Element {
  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h5">Sign in</Typography>
        <Stack spacing={2}>
          <Button
            color="secondary"
            endIcon={<Box alt="" component="img" height={24} src={oAuthProviders[0].logo} width={24} />}
            onClick={() => {
              window.location.href = '/api/auth/login';
            }}
            variant="outlined"
          >
            Continue with {oAuthProviders[0].name}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}