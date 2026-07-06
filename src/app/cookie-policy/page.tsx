import { LegalPage } from "@/frontend/components/legal/legal-page";
import { getLegalPage, getLegalPageMetadata } from "@/frontend/constants/legal-pages";

export const metadata = getLegalPageMetadata("cookie-policy");

export default function CookiePolicyPage() {
  return <LegalPage page={getLegalPage("cookie-policy")} />;
}
