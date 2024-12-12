import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404',
};

export default function Page() {
  return (
    <div>
      <h1>404 Not Found</h1>
    </div>
  );
}
