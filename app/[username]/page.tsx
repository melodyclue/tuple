import { db } from '@/db';
import { profile } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';
import { eq } from 'drizzle-orm';
import { EditProfile } from './edit-profile';
import { PublicProfile } from './public-profile';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const getProfile = async (username: string) => {
  const data = await db.query.profile.findFirst({
    where: eq(profile.username, username),
    with: {
      links: {
        orderBy: (links, { asc }) => [asc(links.position)],
      },
    },
  });
  return data;
};

type Params = {
  username: string;
};

const DashboardPage: React.FC<{
  params: Promise<Params>;
}> = async ({ params }) => {
  const { username } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const data = await getProfile(username);

  if (!data) {
    return <div>This profile does not exist</div>;
  }

  const isOwner = user && data.id === user.id;

  return isOwner ? (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
      <Header />
      <EditProfile data={data} userId={user.id} />
    </div>
  ) : (
    <div className="grid min-h-screen grid-rows-[1fr_auto]">
      <PublicProfile data={data} />
      <Footer />
    </div>
  );
};

export default DashboardPage;
