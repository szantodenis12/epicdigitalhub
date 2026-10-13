import { LegalPage, legalMetadata } from "../../_pages/legal";

export const metadata = legalMetadata("en", "terms");

export default function Page() {
  return <LegalPage locale="en" legalKey="terms" />;
}
