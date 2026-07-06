import { LegalPage } from "@/frontend/components/legal/legal-page";
import { getLegalPage, getLegalPageMetadata } from "@/frontend/constants/legal-pages";

export const metadata = getLegalPageMetadata("advertising-policy");

export default function AdvertisingPolicyPage() {
  return <LegalPage page={getLegalPage("advertising-policy")} />;
}
