import { LegalPage } from "@/frontend/components/legal/legal-page";
import { getLegalPage, getLegalPageMetadata } from "@/frontend/constants/legal-pages";

export const metadata = getLegalPageMetadata("privacy-policy");

export default function PrivacyPolicyPage() {
  return <LegalPage page={getLegalPage("privacy-policy")} />;
}
