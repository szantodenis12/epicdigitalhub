import { ArticlesIndex, articlesMetadata } from "../../../_pages/articles";

export const metadata = articlesMetadata("ro");

export default function Page() {
  return <ArticlesIndex locale="ro" />;
}
