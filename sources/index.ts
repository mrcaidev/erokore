import type { SourceConfig } from "@/utils/types";
import { customSourceConfig } from "./custom";
import { jmcomicSourceConfig } from "./jmcomic";
import { missavSourceConfig } from "./missav";

// biome-ignore lint/suspicious/noExplicitAny: 对外屏蔽 SourceConfig 内部泛型的具体类型
export const sourceConfigs: SourceConfig<any>[] = [
  customSourceConfig,
  missavSourceConfig,
  jmcomicSourceConfig,
];
