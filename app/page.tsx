import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import Hero from '@/components/hero';

export default async function Index() {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
      <Header />
      <div className="pt-10">
        <Hero />
      </div>
      <Footer />
    </div>
  );
}
