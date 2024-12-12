import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';
import './globals.css';

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Tuple',
  description: 'The fastest way to share your links',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <main className="grid min-h-screen grid-rows-[auto_1fr_auto]">
            {/* <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
              <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm">
                <div className="flex items-center gap-5 font-semibold">
                  <Link href={'/'}>Tuple</Link>
                </div>
                {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
              </div>
            </nav> */}
            <div>{children}</div>

            {/* <footer className="mx-auto flex w-full items-center justify-center gap-8 border-t py-4 text-center text-xs">
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
            </footer> */}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
