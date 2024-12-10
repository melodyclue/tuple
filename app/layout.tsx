// import DeployButton from '@/components/deploy-button';
import { EnvVarWarning } from '@/components/env-var-warning';
import HeaderAuth from '@/components/header-auth';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import './globals.css';
import { Suspense } from 'react';

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <main className="grid min-h-screen grid-rows-[auto_1fr_auto]">
            <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
              <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm">
                <div className="flex items-center gap-5 font-semibold">
                  <Link href={'/'}>Tuple</Link>
                  {/* <div className="flex items-center gap-2">
                    <DeployButton />
                  </div> */}
                </div>
                {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
              </div>
            </nav>
            <div className="p-5">{children}</div>

            <footer className="mx-auto flex w-full items-center justify-center gap-8 border-t py-4 text-center text-xs">
              <p>
                Powered by{' '}
                <a
                  href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                  target="_blank"
                  className="font-bold hover:underline"
                  rel="noreferrer"
                >
                  Supabase
                </a>
              </p>
              <ThemeSwitcher />
            </footer>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
