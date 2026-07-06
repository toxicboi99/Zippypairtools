import { LegalPage } from "@/frontend/components/legal/legal-page";
import { getLegalPage, getLegalPageMetadata } from "@/frontend/constants/legal-pages";

export const metadata = getLegalPageMetadata("editorial-policy");

export default function EditorialPolicyPage() {
  return <LegalPage page={getLegalPage("editorial-policy")} />;
}
