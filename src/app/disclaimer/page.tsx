import { LegalPage } from "@/frontend/components/legal/legal-page";
import { getLegalPage, getLegalPageMetadata } from "@/frontend/constants/legal-pages";

export const metadata = getLegalPageMetadata("disclaimer");

export default function DisclaimerPage() {
  return <LegalPage page={getLegalPage("disclaimer")} />;
}
