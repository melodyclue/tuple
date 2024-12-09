import { List } from "@/components/list";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
     <div className="p-8">
      <div className="mx-auto flex w-full max-w-screen-md flex-col items-center justify-center gap-8">
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <div className="h-24 w-24 rounded-full bg-orange-200" />
          <h1 className="text-4xl font-bold">John Doe</h1>
          <p className="text-slate-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </div>
        <div className="w-full flex-1">
          <List />
        </div>
      </div>
    </div>
  )

  // return (
  //   <div className="flex-1 w-full flex flex-col gap-12">
  //     <div className="w-full">
  //       <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
  //         <InfoIcon size="16" strokeWidth={2} />
  //         This is a protected page that you can only see as an authenticated
  //         user
  //       </div>
  //     </div>
  //     <div className="flex flex-col gap-2 items-start">
  //       <h2 className="font-bold text-2xl mb-4">Your user details</h2>
  //       <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
  //         {JSON.stringify(user, null, 2)}
  //       </pre>
  //     </div>
  //     <div>
  //       <h2 className="font-bold text-2xl mb-4">Next steps</h2>
  //       <FetchDataSteps />
  //     </div>
  //   </div>
  // );
}
