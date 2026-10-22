import { createContext, useContext, type ReactNode } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getSiteContent } from "./content.functions";
import { defaultContent, type SiteContent } from "./content";

export const siteContentQuery = queryOptions({
  queryKey: ["site-content"],
  queryFn: () => getSiteContent(),
  staleTime: 30_000,
});

const SiteContentContext = createContext<SiteContent>(defaultContent);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const { data } = useSuspenseQuery(siteContentQuery);
  return <SiteContentContext.Provider value={data ?? defaultContent}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
