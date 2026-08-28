import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GD Node Hosting Example by Costa D" },
      { name: "description", content: "A simple example hosting portal. Sign up to access your personal dashboard." },
      { property: "og:title", content: "GD Node Hosting Example by Costa D" },
      { property: "og:description", content: "A simple example hosting portal. Sign up to access your personal dashboard." },
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
        <p className="text-sm font-medium tracking-widest text-primary uppercase">Example portal</p>
        <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
          GD Node Hosting
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
          A simple example hosting dashboard by Costa D. Create an account to access your private
          node-hosting overview.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {signedIn ? (
            <Link
              to="/members"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Go to your dashboard
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
