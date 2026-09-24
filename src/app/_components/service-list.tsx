"use client";

/* The /services hub's list: the home page's hover accordion, with each row's
   media being that service's own 23.6° device instead of a photograph (the
   handoff's rule: no imagery on the service pages, only the brand geometry).
   A client wrapper because the accordion takes its media as a function. */

import { HoverAccordion, mediaMotion } from "./hover-accordion";
import { ServiceDevice } from "./service-device";

export type ServiceListItem = {
  slug: string;
  name: string;
  description: string;
  href: string;
  linkLabel: string;
};

export function ServiceList({ items }: { items: ServiceListItem[] }) {
  return (
    <HoverAccordion
      items={items.map((s) => ({
        key: s.slug,
        title: s.name,
        body: s.description,
        link: { href: s.href, label: s.linkLabel },
      }))}
      media={(i, isActive) => {
        const m = mediaMotion(isActive);
        return (
          <div className={`bg-white/[0.04] text-white ${m.className}`} style={m.style}>
            <ServiceDevice slug={items[i].slug} cover className="h-full w-full" />
          </div>
        );
      }}
    />
  );
}
