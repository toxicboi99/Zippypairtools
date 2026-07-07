import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";

export default function NotFound() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <span className="mx-auto flex size-14 items-center justify-center rounded-lg border bg-card text-primary">
          <SearchX aria-hidden="true" className="size-7" />
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-normal text-foreground">
          Page not found
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          This URL does not match an active ZippyPair Tools page. Use the tool
          directory or return home to continue with a valid page.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/#tools-search">Find tools</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
