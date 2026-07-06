import { LegalPage } from "@/frontend/components/legal/legal-page";
import { getLegalPage, getLegalPageMetadata } from "@/frontend/constants/legal-pages";

export const metadata = getLegalPageMetadata("dmca");

export default function DmcaPage() {
  return <LegalPage page={getLegalPage("dmca")} />;
}
