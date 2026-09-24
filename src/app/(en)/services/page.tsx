import { ServicesHub, servicesHubMetadata } from "../../_pages/services";

export const metadata = servicesHubMetadata("en");

export default function Page() {
  return <ServicesHub locale="en" />;
}
