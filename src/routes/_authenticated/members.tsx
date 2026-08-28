import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/members")({
  head: () => ({
    meta: [
      { title: "Membership Area — Hello Membership" },
      { name: "description", content: "Your private membership area with exclusive content." },
      { property: "og:title", content: "Membership Area — Hello Membership" },
      { property: "og:description", content: "Your private membership area with exclusive content." },
    ],
  }),
  component: MembersPage,
});

const exampleContent = [
  {
    title: "Getting started",
    body: "This is your default membership page — you can modify this as needed. Replace these cards with your own exclusive content, downloads, or videos.",
  },
  {
    title: "Member resource #1",
    body: "Add links to guides, courses, community spaces, or anything else your members should see first.",
  },
  {
    title: "Member resource #2",
    body: "Only signed-in members can view this page. Use it as a starting point for your own members-only experience.",
  },
];

function MembersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = Route.useRouteContext();

  const { data: profile } = useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle();
      return data;
    },
  });

  const displayName = profile?.display_name || user.email?.split("@")[0] || "member";

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Members only</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
        Welcome, {displayName}!
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        You're signed in. This is your default membership page — you can modify this as needed.
      </p>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {exampleContent.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <h2 className="font-display text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </article>
        ))}
        <article className="rounded-2xl border border-dashed border-border bg-secondary/50 p-6">
          <h2 className="font-display text-lg font-semibold">Your content here</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Duplicate these cards to build out your real member content.
          </p>
        </article>
      </section>

      <button
        onClick={handleSignOut}
        className="mt-10 inline-flex items-center justify-center rounded-lg border border-input bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
      >
        Sign out
      </button>
    </main>
  );
}
