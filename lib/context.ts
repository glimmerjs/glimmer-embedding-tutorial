import { Option, CompilableProgram } from "@glimmer/interfaces";
import { Context, Component, ResolverDelegate } from "@glimmer/opcode-compiler";
import { precompile } from "@glimmer/compiler";
import { keys } from "@glimmer/util";

const COMPONENTS = {
  Second: {
    source: `<p>{{@hello}} {{@world}}{{@suffix}} ({{increment @num}})</p>`,
    handle: 1
  }
};

const HELPERS = {
  increment: 0
};

export const RESOLVER_DELEGATE: ResolverDelegate = {
  getLayout(handle: number): Option<CompilableProgram> | void {
    let key = keys(COMPONENTS).find(k => COMPONENTS[k].handle === handle);

    if (key) {
      return Component(precompile(COMPONENTS[key].source));
    }
  },

  lookupHelper(name: keyof typeof HELPERS): Option<number> | void {
    if (name in HELPERS) return HELPERS[name];
  },

  lookupComponentDefinition(
    name: keyof typeof COMPONENTS
  ): Option<number> | void {
    if (name in COMPONENTS) {
      return COMPONENTS[name].handle;
    }
  }
};

/**
 * The ResolverDelegate is an object that resolves global names in modules at compile-time.
 * If possible, the ResolverDelegate can also tell the compiler that a particular component
 * uses a restricted subset of all available component capabilities, which allows the
 * compiler to specialize the bytecode used when invoking that component.
 *
 * The `SyntaxCompilationContext` is the internal compilation context used to compile all
 * modules.
 */

export const context = Context(RESOLVER_DELEGATE);

export function compile(source: string) {
  /**
   * Precompile the source code for this module into the wire format. In JIT mode, the wire format
   * is shipped over the wire, and the compilation process is finished as needed. In AOT (which
   * we're using here), we continue to compile the wire format immediately.
   */

  let wire = precompile(source);
  console.log("Wire Format", wire);

  /**
   * Rehydrate the wire format into a compilable module.
   */

  let component = Component(wire);
  console.log("Compilable component", component);

  /**
   * Compile the module, getting back a handle that we can use to invoke it
   */

  let compiled = component.compile(context);
  console.log("Compiled Handle", compiled);

  return compiled;
}
