import { LegalPage, legalMetadata } from "../../_pages/legal";

export const metadata = legalMetadata("en", "privacy");

export default function Page() {
  return <LegalPage locale="en" legalKey="privacy" />;
}
