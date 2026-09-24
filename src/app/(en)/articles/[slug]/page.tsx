import { ArticlePage, articleMetadata, articleParams } from "../../../_pages/articles";

type Props = { params: Promise<{ slug: string }> };

// Only the slugs in the copy exist; anything else is a 404, not a render.
export const dynamicParams = false;
export const generateStaticParams = articleParams;

export async function generateMetadata({ params }: Props) {
  return articleMetadata("en", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <ArticlePage locale="en" slug={(await params).slug} />;
}
