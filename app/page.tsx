import { Header } from '@/components/header';
import Hero from '@/components/hero';

export default async function Index() {
  return (
    <>
      <Header />
      <div className="pt-10">
        <Hero />
      </div>
    </>
  );
}
