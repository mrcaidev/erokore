import type { SelectProps } from "@radix-ui/react-select";
import { PERMISSION_LEVEL_LABEL_MAP } from "@/utils/permission";
import type { PermissionLevel } from "@/utils/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export type PermissionLevelSelectOption = {
  value: PermissionLevel;
  label?: string;
  disabled?: boolean;
};

export type PermissionLevelSelectProps = SelectProps & {
  options: PermissionLevelSelectOption[];
  defaultable?: boolean;
  defaultLabel?: string;
  onChange?: () => void;
};

export const PermissionLevelSelect = ({
  options,
  defaultable = false,
  defaultLabel = "跟随默认",
  onChange,
  ...props
}: PermissionLevelSelectProps) => {
  return (
    <Select onValueChange={onChange} {...props}>
      <SelectTrigger>
        <SelectValue placeholder="请选择" />
      </SelectTrigger>
      <SelectContent>
        {defaultable && <SelectItem value="default">{defaultLabel}</SelectItem>}
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label || PERMISSION_LEVEL_LABEL_MAP[option.value]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
