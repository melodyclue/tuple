import Image from "next/image";
import { auth } from "~/lib/auth";

export const Header = async () => {
  const session = await auth();

  return (
    <div className="w-full px-8 py-2">
      <div className="flex w-full justify-between">
        <h1 className="text-xl font-bold">Tuple</h1>
        <div className="flex items-center gap-4">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name ?? ""}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-slate-200"></div>
          )}
        </div>
      </div>
    </div>
  );
};
