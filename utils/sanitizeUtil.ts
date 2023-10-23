// utils/sanitizeUtil.ts

import sanitizeHtml from "sanitize-html";

export const sanitizeContent = (dirtyHtml: string): string => {
  return sanitizeHtml(dirtyHtml, {
    allowedTags: [
      "p",
      "span",
      "ul",
      "li",
      "ol",
      "sup",
      "sub",
      "s",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "u",
      "blockquote",
      "pre",
      "code",
      "em",
      "strong",
      "a",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      pre: ["class"],
      span: ["style"],
    },
    allowedStyles: {
      span: {
        color: [/.*/],
        "background-color": [/.*/],
      },
    },
    transformTags: {
      // Allow certain class values for <pre> elements
      pre: function (tagName, attribs) {
        return {
          tagName: "pre",
          attribs: {
            class: "ql-syntax hljs ",
            spellcheck: "false",
          },
        };
      },
      a: function (tagName, attribs) {
        return {
          tagName: "a",
          attribs: {
            href: attribs.href,
            target: "_blank",
            rel: "noopener noreferrer",
          },
        };
      },
    },
    textFilter: function (text, tagName) {
      text = text.replace(/&gt;/g, ">").replace(/&amp;/g, "&");
      if (tagName === "pre" && text.charAt(0) !== "\n") {
        // Ensure there's a newline at the start for code blocks
        return "\n" + text;
      }
      return text;
    },
  });
};
