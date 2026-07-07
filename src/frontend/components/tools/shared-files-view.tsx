"use client";

import { useEffect, useState } from "react";
import { Download, File, Loader2 } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent } from "@/frontend/components/ui/card";

interface ShareInfo { shareId: string; expiresAt: string; files: Array<{ id: string; name: string; size: number }> }

export function SharedFilesView({ shareId }: { shareId: string }) {
  const [share, setShare] = useState<ShareInfo | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/share-files/${shareId}`, { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json() as { data?: ShareInfo; error?: string };
        if (!response.ok || !payload.data) throw new Error(payload.error ?? "This share is unavailable.");
        setShare(payload.data);
      })
      .catch((reason: Error) => setError(reason.message));
  }, [shareId]);

  if (error) return <p role="alert" className="rounded-lg border bg-card p-6 text-destructive">{error}</p>;
  if (!share) return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 aria-hidden="true" className="animate-spin" />Loading shared files...</div>;

  return (
    <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Available until {new Date(share.expiresAt).toLocaleString()}</p><ul className="mt-5 space-y-3">{share.files.map((file) => <li key={file.id} className="flex flex-wrap items-center gap-3 rounded-lg border p-3"><File aria-hidden="true" className="size-5 text-primary" /><span className="min-w-0 flex-1 truncate font-medium">{file.name}</span><span className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span><Button asChild size="sm"><a href={`/api/share-files/${share.shareId}/${file.id}`}><Download aria-hidden="true" />Download</a></Button></li>)}</ul></CardContent></Card>
  );
}
