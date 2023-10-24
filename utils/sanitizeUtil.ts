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
      // "pre",
      "code",
      "em",
      "strong",
      "a",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      // pre: ["class"],
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
      /*       pre: function (tagName, attribs) {
        return {
          tagName: "pre",
          attribs: {
            class: "ql-syntax hljs ",
            spellcheck: "false",
          },
        };
      }, */
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
      // Decode special HTML entities
      text = text.replace(/&gt;/g, ">").replace(/&amp;/g, "&");

      // 1. Remove spaces around "-"
      text = text.replace(/\s-\s/g, "-");

      // 2. Clean up code blocks
      text = text.replace(/=\s*\>\s*\{/g, " => {"); // Adjust for => {
      text = text.replace(/&\s*/g, " & ");
      text = text.replace(/\{\s+/g, "{").replace(/\s+\}/g, "}"); // Clean inside curly braces
      text = text.replace(/\(\s+/g, "(").replace(/\s+\)/g, ")"); // Clean inside parentheses
      text = text.replace(/;\s+/g, "; "); // Clean after semicolons
      text = text.replace(/\s*\}\s*;/g, "};"); // Clean before closing curly braces followed by semicolon

      // 3. Clean spaces around ":"
      text = text.replace(/\s:\s/g, ": ");

      // 4. Additional clean-up
      text = text.replace(/\s{2,}/g, " "); // Remove extra spaces
      text = text.replace(/\s*\n\s*/g, "\n"); // Remove spaces around newlines

      // Ensure there's a newline at the start for code blocks
      if (tagName === "pre" && text.charAt(0) !== "\n") {
        text = "\n" + text;
      }

      return text;
    },
  });
};
