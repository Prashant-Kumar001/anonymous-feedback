"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User | undefined = session?.user;

  return (
    <nav className="bg-white  px-6 py-4 border-b  flex justify-between items-center">
      <div className="text-2xl font-bold ">
        <Link href="/">Mystery Messages</Link>
      </div>


      <div>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline font-medium">{user.name}</span>
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Button variant={"outline"} size={"sm"} type="button" asChild>
            <Link href="/auth/signin">Sign in</Link>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
