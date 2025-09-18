import type { SelectProps } from "@radix-ui/react-select";
import { PERMISSION_LEVEL_LABEL_MAP } from "@/utils/permission";
import type { DefaultablePermissionLevel } from "@/utils/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export type PermissionLevelSelectOption = {
  value: DefaultablePermissionLevel;
  label?: string;
  disabled?: boolean;
};

export type PermissionLevelSelectProps = SelectProps & {
  options: PermissionLevelSelectOption[];
  onChange?: () => void;
};

export const PermissionLevelSelect = ({
  options,
  onChange,
  ...props
}: PermissionLevelSelectProps) => {
  return (
    <Select onValueChange={onChange} {...props}>
      <SelectTrigger>
        <SelectValue placeholder="请选择" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label ||
              (option.value === "default"
                ? "跟随默认"
                : PERMISSION_LEVEL_LABEL_MAP[option.value])}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
