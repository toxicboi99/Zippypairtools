import { LegalPage } from "@/frontend/components/legal/legal-page";
import { getLegalPage, getLegalPageMetadata } from "@/frontend/constants/legal-pages";

export const metadata = getLegalPageMetadata("about");

export default function AboutPage() {
  return <LegalPage page={getLegalPage("about")} />;
}
