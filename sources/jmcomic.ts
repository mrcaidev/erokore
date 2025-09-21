import type { SourceConfig } from "@/utils/types";

export const jmcomicSourceConfig: SourceConfig<string> = {
  source: "jmcomic",
  name: "禁漫天堂",
  rules: [
    {
      match: (input) => input.match(/^(?:jm)?(\d{6,7})$/i)?.[1],
      priority: 10,
    },
    {
      match: (input) =>
        input.match(/^https?:\/\/18comic\.vip\/album\/([^/]+)/i)?.[1],
    },
  ],
  scrape: async (id) => {
    const { createHash, createDecipheriv } = await import("node:crypto");

    const now = Math.floor(Date.now() / 1000);

    const reqSecret = createHash("md5")
      .update(`${now}18comicAPPContent`)
      .digest("hex");
    const resSecret = createHash("md5")
      .update(`${now}185Hcomic3PAPP7R`)
      .digest("hex");

    const res = await fetch(`https://www.cdntwice.org/album?id=${id}`, {
      headers: {
        token: reqSecret,
        tokenparam: `${now},2.0.6`,
      },
    });
    const { data } = await res.json();

    const decipheriv = createDecipheriv("aes-256-ecb", resSecret, null);
    const cleartext =
      decipheriv.update(data, "base64", "utf-8") + decipheriv.final("utf-8");

    const json = JSON.parse(cleartext);

    return {
      title: json.name,
      description: json.description,
      url: `https://18comic.vip/album/${id}`,
      coverUrl: `https://cdn-msp.18comic.vip/media/albums/${id}.jpg`,
    };
  },
  badge: {
    icon: "image",
    className: "bg-orange-500 text-white",
  },
};
