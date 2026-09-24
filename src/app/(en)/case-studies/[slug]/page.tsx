import { CaseStudyPage, caseStudyMetadata, caseStudyParams } from "../../../_pages/case-studies";

type Props = { params: Promise<{ slug: string }> };

// Only the slugs in the copy exist; anything else is a 404, not a render.
export const dynamicParams = false;
export const generateStaticParams = caseStudyParams;

export async function generateMetadata({ params }: Props) {
  return caseStudyMetadata("en", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <CaseStudyPage locale="en" slug={(await params).slug} />;
}
