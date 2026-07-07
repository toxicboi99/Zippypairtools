import type { Metadata } from "next";
import Link from "next/link";

import { SharedFilesView } from "@/frontend/components/tools/shared-files-view";

export const metadata: Metadata = {
  title: "Shared Files | ZippyPair Tools",
  description: "Download files shared privately through ZippyPair Tools.",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function SharedFilesPage({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  return <section className="py-12 sm:py-16"><div className="mx-auto max-w-3xl px-4 sm:px-6"><Link href="/tools/share-files" className="text-sm font-medium text-primary hover:underline">Share your own files</Link><h1 className="mt-5 text-3xl font-semibold sm:text-4xl">Shared files</h1><p className="mt-3 mb-8 text-muted-foreground">Review each filename before downloading it to your device.</p><SharedFilesView shareId={shareId} /></div></section>;
}
