import { precompile } from "@glimmer/compiler";
import {
  CompilableProgram,
  CompileTimeComponent,
  Option
} from "@glimmer/interfaces";
import {
  Component,
  MINIMAL_CAPABILITIES,
  ResolverDelegate
} from "@glimmer/opcode-compiler";

// A map of helpers to runtime handles (that will be passed to the runtime resolver).
const HELPERS = {
  increment: 0
};

// A map of components to their source code and the runtime handle (that will be passed
// to the runtime resolver).
const COMPONENTS = {
  Second: {
    source: `<p>{{@hello}} {{@world}}{{@suffix}} ({{increment @num}})</p>`,
    handle: 1
  }
};

export const RESOLVER_DELEGATE: ResolverDelegate = {
  lookupComponent(
    name: keyof typeof COMPONENTS
  ): Option<CompileTimeComponent> | void {
    let component = COMPONENTS[name];
    if (component === null) return null;

    let { handle, source } = component;

    return {
      handle,
      compilable: Compilable(source),
      capabilities: MINIMAL_CAPABILITIES
    };
  },

  lookupHelper(name: keyof typeof HELPERS): Option<number> | void {
    if (name in HELPERS) return HELPERS[name];
  }
};

export function Compilable(source: string): CompilableProgram {
  return Component(precompile(source));
}
