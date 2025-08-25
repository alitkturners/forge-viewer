'use client';

import React from 'react';
import { getModelProperties } from '@/utils/modelProperties';
import { selectProperties } from '@/utils/selectProperties';
import { Box, Typography } from '@mui/material';

function SpoolPropertiesListing({ search }: { search: string }) {
  let properties = getModelProperties();

  return (
    <div>
      {Object?.keys(properties)?.map((i: any) => {
        if (i?.toLowerCase()?.includes(search?.toLocaleLowerCase())) {
          // @ts-ignore
          const objectIds = properties?.[i]?.map((p: any) => p?.objectId);
          return (
            <Box sx={{ my: 1 }}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => selectProperties(objectIds)}
              >
                <img
                  src="/assets/externa-link.png"
                  alt="lnk"
                  style={{ marginRight: '12px', width: '14px', height: '14px' }}
                />
                <Typography sx={{}}>{i}</Typography>
              </Box>
            </Box>
          );
        }
        return null;
      })}
    </div>
  );
}

export default SpoolPropertiesListing;
