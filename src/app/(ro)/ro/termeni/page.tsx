import { LegalPage, legalMetadata } from "../../../_pages/legal";

export const metadata = legalMetadata("ro", "terms");

export default function Page() {
  return <LegalPage locale="ro" legalKey="terms" />;
}
