import { LegalPage } from "@/frontend/components/legal/legal-page";
import { getLegalPage, getLegalPageMetadata } from "@/frontend/constants/legal-pages";

export const metadata = getLegalPageMetadata("content-policy");

export default function ContentPolicyPage() {
  return <LegalPage page={getLegalPage("content-policy")} />;
}
