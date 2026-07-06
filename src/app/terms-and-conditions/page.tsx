import { LegalPage } from "@/frontend/components/legal/legal-page";
import { getLegalPage, getLegalPageMetadata } from "@/frontend/constants/legal-pages";

export const metadata = getLegalPageMetadata("terms-and-conditions");

export default function TermsAndConditionsPage() {
  return <LegalPage page={getLegalPage("terms-and-conditions")} />;
}
