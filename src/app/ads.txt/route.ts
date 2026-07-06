export const dynamic = "force-static";

export function GET() {
  const publisherId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT?.replace(
    /^ca-/,
    "",
  );
  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : "# Add NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX before serving monetized ads.\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
