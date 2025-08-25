import * as React from 'react';
import type { Viewport } from 'next';

import '@/styles/global.css';

import { config } from '@/config';
import { applyDefaultSettings } from '@/lib/settings/apply-default-settings';
import { getSettings as getPersistedSettings } from '@/lib/settings/get-settings';
import { UserProvider } from '@/contexts/auth/user-context';
import { SettingsProvider } from '@/contexts/settings';
import { Analytics } from '@/components/core/analytics';
import { I18nProvider } from '@/components/core/i18n-provider';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { SettingsButton } from '@/components/core/settings/settings-button';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { Toaster } from '@/components/core/toaster';

import { ReduxStateProvider } from '../redux/ReduxStateProvider';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: config.site.themeColor,
} satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}
export const dynamic = 'force-dynamic';

export default async function Layout({ children }: LayoutProps): Promise<React.JSX.Element> {
  const settings = applyDefaultSettings(await getPersistedSettings());

  return (
    <html data-mui-color-scheme={settings.colorScheme} lang="en">
      <head>
        <link href="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.css" rel="stylesheet" />
      </head>
      <body>
        <Analytics>
          <LocalizationProvider>
            <UserProvider>
              <ReduxStateProvider>
                <SettingsProvider settings={settings}>
                  <I18nProvider language="en">
                    <ThemeProvider>
                      {children}
                      <SettingsButton />
                      <Toaster position="bottom-right" />
                    </ThemeProvider>
                  </I18nProvider>
                </SettingsProvider>
              </ReduxStateProvider>
            </UserProvider>
          </LocalizationProvider>
        </Analytics>
      </body>
    </html>
  );
}
