import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "./login";

export const Route = createFileRoute("/signup")({
  component: () => <AuthShell mode="signup" />,
  head: () => ({
    meta: [
      { title: "Create your Hash account" },
      { name: "description", content: "Start clipping livestreams in under a minute. 30 free clips a month, forever." },
    ],
  }),
});
