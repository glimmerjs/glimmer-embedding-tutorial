import { ResolvedValue, RuntimeResolver } from "@glimmer/interfaces";
import { map } from "@glimmer/reference";
import { TEMPLATE_ONLY_COMPONENT } from "@glimmer/runtime";

// prettier-ignore
const TABLE: ResolvedValue[] = [
  // handle 0 is the increment helper
  args => map(args.positional.at(0), (i: number) => i + 1),

  // handle 1 is a template only component
  TEMPLATE_ONLY_COMPONENT
];

export const RUNTIME_RESOLVER: RuntimeResolver = {
  resolve(handle: number): ResolvedValue | void {
    if (handle < TABLE.length) {
      return TABLE[handle];
    }
  }
};
