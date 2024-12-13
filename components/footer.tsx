import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="mx-auto flex w-full flex-col items-center justify-center gap-5 border-t py-4 text-center text-xs">
      <Link href="/">
        <p className="font-semibold text-secondary-foreground">© 2024 Tuple</p>
      </Link>
    </footer>
  );
};
