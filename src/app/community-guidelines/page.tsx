import { LegalPage } from "@/frontend/components/legal/legal-page";
import { getLegalPage, getLegalPageMetadata } from "@/frontend/constants/legal-pages";

export const metadata = getLegalPageMetadata("community-guidelines");

export default function CommunityGuidelinesPage() {
  return <LegalPage page={getLegalPage("community-guidelines")} />;
}
