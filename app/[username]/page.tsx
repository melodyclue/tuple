import { db } from '@/db';
import { profile } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';
import { eq } from 'drizzle-orm';
import { EditProfile } from './edit-profile';
import { PublicProfile } from './public-profile';
import { Header } from '@/components/header';

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
    <>
      <Header />
      <EditProfile data={data} userId={user.id} />
    </>
  ) : (
    <PublicProfile data={data} />
  );
};

export default DashboardPage;
