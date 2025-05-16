"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export function SignInButton({ provider = "google", redirectTo = "/auth-success" }: { provider?: string, redirectTo?: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);

      // Log the sign-in attempt
      console.log(`[SignInButton] Signing in with ${provider}, redirecting to ${redirectTo}`);

      // Use our custom signIn function that handles redirects properly
      await signIn(provider, { redirectTo });

      // Note: The above function will redirect, so the code below won't execute
      // But we'll keep it for error handling
    } catch (error) {
      console.error("[SignInButton] Error during sign-in:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {isLoading ? "Signing in..." : `Sign in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
    </button>
  );
}

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      console.log("[SignOutButton] Signing out");

      // Use the signOut function from next-auth/react
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("[SignOutButton] Error during sign-out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
    >
      {isLoading ? "Signing out..." : "Sign out"}
    </button>
  );
}

export function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated" || !session) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p>You are not signed in</p>
        <SignInButton provider="google" />
        <SignInButton provider="github" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        {session.user?.image && (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-10 h-10 rounded-full"
          />
        )}
        <div>
          <p className="font-bold">{session.user?.name}</p>
          <p className="text-sm text-gray-500">{session.user?.email}</p>
        </div>
      </div>
      <SignOutButton />
    </div>
  );
}

export function AuthStatus() {
  const { data: session, status } = useSession();

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h2 className="text-lg font-bold mb-2">Authentication Status</h2>
      <pre className="bg-white p-2 rounded overflow-auto max-h-40">
        {JSON.stringify({ status, session }, null, 2)}
      </pre>
      <div className="mt-4">
        {status === "authenticated" ? (
          <SignOutButton />
        ) : (
          <div className="flex gap-2">
            <SignInButton provider="google" />
            <SignInButton provider="github" />
          </div>
        )}
      </div>
      <div className="mt-4">
        <Link href="/auth-test" className="text-blue-500 hover:underline">
          Go to Auth Test Page
        </Link>
      </div>
    </div>
  );
}
