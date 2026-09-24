import { ArticlesIndex, articlesMetadata } from "../../_pages/articles";

export const metadata = articlesMetadata("en");

export default function Page() {
  return <ArticlesIndex locale="en" />;
}
