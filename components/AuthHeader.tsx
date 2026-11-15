
"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth";
import T from "./typography";

export default function AuthHeader() {
  const auth = useAuth();

  const handleLogout = async () => {
    await auth.logout();
  };

  return (
    <div>
      {!auth.user && (
        <div>
          <T.Header>Not logged in</T.Header>
          <Link href="/auth/login">Log in</Link>
        </div>
      )}

      {auth.user && (
        <div>
          <T.Header>Logged in {auth.user.email}</T.Header>
          <button onClick={handleLogout}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
