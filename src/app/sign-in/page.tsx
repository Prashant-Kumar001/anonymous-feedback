'use client'
import { Button } from "@/components/ui/button";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  return (
    <div>
      {session ? (
        <div>
          <p>Signed in as {session.user?.email}</p>
          <Button
            variant={"outline"}
            size={"sm"}
            type="button"
            onClick={() => signOut()}
          >
            Sign out
          </Button>
        </div>
      ) : (
        <div>
          <p>Not signed in.</p>
          <Button variant={"outline"} size={"sm"} type="button" asChild >
            <Link href="/auth/signin">Sign in</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
