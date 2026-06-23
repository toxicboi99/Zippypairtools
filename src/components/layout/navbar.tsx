import Link from "next/link";
import { ArrowRight, Search, Zap } from "lucide-react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { navLinks, siteConfig } from "@/constants/site";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-xl">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Zap aria-hidden="true" className="size-5" />
          </span>
          <span className="text-base font-semibold text-foreground sm:text-lg">
            {siteConfig.shortName}
          </span>
          <span className="hidden rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary sm:inline-flex">
            Tools
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="ml-auto md:ml-2"
        >
          <a href="#tools-search">
            <Search aria-hidden="true" />
            <span className="hidden sm:inline">Find tools</span>
          </a>
        </Button>

        <ThemeToggle />

        <Button asChild size="sm" className="hidden sm:inline-flex">
          <a href="#popular">
            Start free
            <ArrowRight aria-hidden="true" />
          </a>
        </Button>
      </nav>
    </header>
  );
}
