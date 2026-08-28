import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hello Membership — a simple hello-world membership app" },
      { name: "description", content: "Welcome! Sign up and get your own private membership area with example content." },
      { property: "og:title", content: "Hello Membership — a simple hello-world membership app" },
      { property: "og:description", content: "Welcome! Sign up and get your own private membership area with example content." },
    ],
  }),
  component: Index,
});

function Index() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium tracking-widest text-primary uppercase">Hello world</p>
        <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
          Hello, welcome!
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
          This is a simple membership app. Create an account and you'll get your own private
          membership page with example content.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {signedIn ? (
            <Link
              to="/members"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Go to your membership area
            </Link>
          ) : (
            <>
              <Link
                to="/auth"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Create a free account
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
