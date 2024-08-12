import '@/app/globals.css';

import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getUserPermission } from '@/server/actions/permission.action';
import { getAllSettings } from '@/server/actions/settings.action';

import { Container, Flex } from '@/components/atoms/layout';
import NextProgress from '@/components/atoms/next-progress';
import { ResizablePanel } from '@/components/atoms/resizable-layout/resizable-layout';
import Footer from '@/components/organisms/footer';
import Header from '@/components/organisms/header';
import { Providers } from '@/components/organisms/providers';
import { Sidebar } from '@/components/organisms/sidebar';
import { geist } from '@/app/font';

export const metadata: Metadata = {
  title: 'FileKit',
  description: 'A starter kit for building SaaS products with Next.js',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getAllSettings();
  const permissions = await getUserPermission();

  const defaultSizeCookies = cookies().get(
    'layout-resizable-panels:default-size'
  );
  const defaultCollapsedCookies = cookies().get(
    'layout-resizable-panels:default-collapsed'
  );

  const defaultSize = defaultSizeCookies
    ? JSON.parse(defaultSizeCookies.value)
    : undefined;
  const defaultCollapsed = defaultCollapsedCookies
    ? JSON.parse(defaultCollapsedCookies.value)
    : undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={geist.variable}>
        <Providers settings={settings} permissions={permissions}>
          <NextProgress />
          <main className="grid flex-grow grid-cols-1 font-geist">
            <ResizablePanel
              defaultSize={defaultSize}
              defaultCollapsed={defaultCollapsed}
              sidebar={
                <Sidebar
                  defaultCollapsed={defaultCollapsed}
                  className="w-full h-full shrink-[unset] relative"
                />
              }
              childrenWrapperClassName="!min-h-screen"
            >
              <div className="flex flex-col h-full bg-background relative">
                <Flex
                  direction="col"
                  justify="start"
                  className="p-5 pt-0 3xl:p-10 3xl:pt-0 grow"
                >
                  <Header />
                  <Container className="relative mt-4">{children}</Container>
                </Flex>
                <Footer variant="dashboard" />
              </div>
            </ResizablePanel>
          </main>
        </Providers>
      </body>
    </html>
  );
}
