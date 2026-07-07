import Link from "next/link";
import { Zap } from "lucide-react";

import { footerColumns, siteConfig } from "@/frontend/constants/site";

export function Footer() {
  return (
    <footer className="border-t bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.3fr_2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap aria-hidden="true" className="size-5" />
              </span>
              <span className="text-lg font-semibold text-foreground">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              {siteConfig.description}
            </p>
            <p className="mt-5 text-sm font-medium text-foreground">
              Made with ❤️ by {siteConfig.creator}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h2 className="text-sm font-semibold text-foreground">
                  {column.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{siteConfig.copyright}</p>
          <p>Built for fast, accessible, responsive tool discovery.</p>
        </div>
      </div>
    </footer>
  );
}
