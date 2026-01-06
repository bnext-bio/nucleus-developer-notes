// node_modules/unist-builder/lib/index.js
function u(type, props, value) {
  const node = { type: String(type) };
  if ((value === void 0 || value === null) && (typeof props === "string" || Array.isArray(props))) {
    value = props;
  } else {
    Object.assign(node, props);
  }
  if (Array.isArray(value)) {
    node.children = value;
  } else if (value !== void 0 && value !== null) {
    node.value = String(value);
  }
  return node;
}

// src/utils.ts
function makePlaceholder(data, description) {
  const optionList = data.options ? [
    u(
      "ul",
      Object.entries(data.options)?.map(
        ([key, value]) => u("listItem", [u("inlineCode", key), u("text", `: ${String(value)}`)])
      ) ?? []
    )
  ] : [];
  return [
    u("admonition", { kind: "important" }, [
      u("admonitionTitle", [u("inlineCode", [u("text", data.name)])]),
      u("paragraph", [
        u("text", "This block will be replaced with "),
        u("strong", [u("text", description)]),
        u("text", " when deployed to "),
        u("link", { url: "https://curvenote.com" }, [u("text", "Curvenote")]),
        u("text", ".")
      ]),
      u("paragraph", [u("text", "Options:"), ...optionList])
    ])
  ];
}

// src/directive.ts
var seqVizDirective = {
  name: "seqviz",
  doc: "A directive that will load seqparse compatible files and setup visualization using the SegViz library.",
  arg: { type: String, doc: "The path to the file to load and parse.`" },
  options: {
    height: { type: String, doc: "The height of the visualization.`" },
    class: { type: String, doc: "The tailwind classes to apply.`" }
  },
  run(data, vfile) {
    const block = u(
      "block",
      {
        kind: "seqviz",
        data: {
          import: "https://curvenote.github.io/widgets/widgets/seqviz.js",
          file: data.arg,
          class: data.options?.class ?? "",
          height: data.options?.height ?? "600px"
        }
      },
      makePlaceholder(data, data.arg)
    );
    return [block];
  }
};

// src/transform.ts
import * as seqparse from "seqparse";
import { readFile } from "node:fs/promises";
var seqparseTransform = {
  name: "seqviz-seqparse",
  doc: "A transform that parses an inoming file and prepares a SeqViz model.",
  stage: "document",
  plugin: (_, utils) => async (node) => {
    const nodes = utils.selectAll("block[kind='seqviz']", node) ?? [];
    await Promise.all(
      nodes.map(async (seqvizNode) => {
        const { file, class: className, height } = seqvizNode.data;
        const fileContent = await readFile(file, "utf8");
        const data = seqparse.parseFile(fileContent);
        const { name, type, seq, annotations } = data[0] ?? {};
        seqvizNode.data = {
          ...seqvizNode.data,
          json: {
            name,
            type,
            seq,
            annotations,
            class: className,
            height
          }
        };
        seqvizNode.kind = "any:bundle";
      })
    );
  }
};

// src/seqviz.ts
var plugin = {
  name: "SeqViz Plugin for MyST Markdown",
  directives: [seqVizDirective],
  transforms: [seqparseTransform]
};
var seqviz_default = plugin;
export {
  seqviz_default as default
};
//# sourceMappingURL=seqviz.mjs.map