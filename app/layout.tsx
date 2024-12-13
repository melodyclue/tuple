import { GeistSans } from 'geist/font/sans';
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
      <body className="grid min-h-screen grid-rows-[auto_1fr_auto] bg-background text-foreground">
        <main>{children}</main>
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
        </footer>
      </body>
    </html>
  );
}
