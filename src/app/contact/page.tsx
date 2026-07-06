import { LegalPage } from "@/frontend/components/legal/legal-page";
import { getLegalPage, getLegalPageMetadata } from "@/frontend/constants/legal-pages";

export const metadata = getLegalPageMetadata("contact");

export default function ContactPage() {
  return <LegalPage page={getLegalPage("contact")} />;
}
