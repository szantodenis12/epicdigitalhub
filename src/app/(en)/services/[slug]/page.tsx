import { ServicePage, serviceMetadata, serviceParams } from "../../../_pages/services";

type Props = { params: Promise<{ slug: string }> };

// Only the slugs in the copy exist; anything else is a 404, not a render.
export const dynamicParams = false;
export const generateStaticParams = serviceParams;

export async function generateMetadata({ params }: Props) {
  return serviceMetadata("en", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <ServicePage locale="en" slug={(await params).slug} />;
}
