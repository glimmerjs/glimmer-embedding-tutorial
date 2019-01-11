import { Cursor } from "@glimmer/interfaces";
import { State } from "@glimmer/object-reference";
import { Context } from "@glimmer/opcode-compiler";
import { artifacts } from "@glimmer/program";
import { renderAot, renderSync, Runtime } from "@glimmer/runtime";
import { strip } from "@glimmer/util";
import createHTMLDocument from "@simple-dom/document";
import { SimpleElement } from "@simple-dom/interface";
import Serializer from "@simple-dom/serializer";
import voidMap from "@simple-dom/void-map";
import { Compilable, RESOLVER_DELEGATE } from "./context";
import { RUNTIME_RESOLVER } from "./env";

let mainSource = strip`
  {{~#let "hello" "world" as |hello world|~}}
    <Second
      @hello={{hello}}
      @world={{world}}
      @suffix={{this.suffix}}
      @num={{this.num}}
    />
  {{~/let~}}
`;

let context = Context(RESOLVER_DELEGATE);
let main = Compilable(mainSource).compile(context);
let payload = artifacts(context);

let document = createHTMLDocument();
let runtime = Runtime(document, payload, RUNTIME_RESOLVER);
let state = State({ suffix: "!", num: 5 });
let element = document.createElement("main");
let cursor: Cursor = { element, nextSibling: null };

let iterator = renderAot(runtime, main, cursor, state);
let result = renderSync(runtime.env, iterator);

console.log(serialize(element));

state.update({ suffix: "?", num: 10 });

result.rerender();
console.log(serialize(element));

function serialize(element: SimpleElement) {
  return new Serializer(voidMap).serialize(element);
}
