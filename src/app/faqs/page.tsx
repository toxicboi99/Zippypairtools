import { LegalPage } from "@/frontend/components/legal/legal-page";
import { getLegalPage, getLegalPageMetadata } from "@/frontend/constants/legal-pages";

export const metadata = getLegalPageMetadata("faqs");

export default function FaqsPage() {
  return <LegalPage page={getLegalPage("faqs")} />;
}
