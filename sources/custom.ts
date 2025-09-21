import type { SourceConfig } from "@/utils/types";

export const customSourceConfig: SourceConfig<string> = {
  source: "custom",
  name: "自定义",
  rules: [
    {
      match: () => "true",
      priority: -1,
    },
  ],
};
