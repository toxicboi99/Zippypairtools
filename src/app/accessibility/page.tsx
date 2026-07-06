import { LegalPage } from "@/frontend/components/legal/legal-page";
import { getLegalPage, getLegalPageMetadata } from "@/frontend/constants/legal-pages";

export const metadata = getLegalPageMetadata("accessibility");

export default function AccessibilityPage() {
  return <LegalPage page={getLegalPage("accessibility")} />;
}
