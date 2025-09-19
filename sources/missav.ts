import type { SourceConfig } from "@/utils/types";

export const missavSourceConfig: SourceConfig<string> = {
  source: "missav",
  name: "MissAV",
  rules: [
    {
      match: (input) => input.match(/^([a-z]+(?:-)?\d+)$/i)?.[1],
    },
    {
      match: (input) =>
        input.match(/^https?:\/\/missav\.(?:com|ws|ai).*\/([^/]+)$/i)?.[1],
    },
  ],
  scrape: async (id) => {
    return {
      title: id.toUpperCase(),
      description: "",
      url: `https://missav.ws/${id.toLowerCase()}`,
      coverUrl: `https://fourhoi.com/${id.toLowerCase()}/cover-n.jpg`,
    };
  },
  badge: {
    icon: "video",
    className: "bg-fuchsia-500 dark:bg-fuchsia-600 text-white",
  },
};
