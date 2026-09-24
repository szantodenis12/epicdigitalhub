import { CaseStudiesIndex, caseStudiesMetadata } from "../../_pages/case-studies";

export const metadata = caseStudiesMetadata("en");

export default function Page() {
  return <CaseStudiesIndex locale="en" />;
}
