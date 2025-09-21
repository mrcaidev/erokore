"use server";

import { sourceConfigs } from "@/sources";

export const inferCollectionItem = async (input: string) => {
  const rules = sourceConfigs
    .flatMap(
      ({ rules, ...restSourceConfig }) =>
        rules?.map((rule) => ({ ...restSourceConfig, rule })) ?? [],
    )
    .toSorted((a, b) => (b.rule.priority ?? 0) - (a.rule.priority ?? 0));

  try {
    for (const { source, rule, scrape } of rules) {
      const id = rule.match(input);
      if (id) {
        const item = await scrape?.(id);
        return { ok: true, source, ...item } as const;
      }
    }
    return { ok: false, error: "识别不出呢……" } as const;
  } catch {
    return { ok: false, error: "识别成功，但是没能获取到相关信息……" } as const;
  }
};
