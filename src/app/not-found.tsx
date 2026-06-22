import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium uppercase text-primary">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-normal text-foreground">
        Tool not found
      </h1>
      <p className="mt-4 text-muted-foreground">
        The page may have moved, or the tool is not available in this build.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Back to homepage</Link>
      </Button>
    </section>
  );
}
