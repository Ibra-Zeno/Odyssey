// QuillEditor.tsx

import { FC } from "react";
import { useEffect } from "react";
import ReactQuill from "react-quill";
import { QuillEditorProps } from "../utils/types";
import "react-quill/dist/quill.snow.css"; // Import styles

const QuillEditor: FC<QuillEditorProps> = ({ content, setContent }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }], // Color functionality
      ["link"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      [{ script: "sub" }, { script: "super" }],
    ],
  };

  useEffect(() => {
    // Set the minimum height of the editor content
    const editorContent = document.querySelector(".ql-editor") as HTMLElement;
    const editorContentHeadings = document.querySelectorAll(
      ".ql-editor h1, .ql-editor h2, .ql-editor h3, .ql-editor h4, .ql-editor h5, .ql-editor h6",
    ) as NodeListOf<HTMLElement>;
    const editorCodeBlock = document.querySelector(".ql-syntax") as HTMLElement;
    if (editorContent) {
      editorContent.style.minHeight = "300px"; // Adjust this value as needed
      editorContent.style.fontFamily = "Source Serif 4";
      editorContent.style.fontSize = "14px";
    }
    if (editorContentHeadings) {
      editorContentHeadings.forEach((heading) => {
        heading.style.fontFamily = "Raleway";
      });
    }
    if (editorCodeBlock) {
      editorCodeBlock.style.fontFamily = "Source Code Pro";
      editorCodeBlock.style.fontSize = "12px";
    }
  }, []);

  return (
    <ReactQuill
      theme="snow"
      value={content}
      onChange={setContent}
      modules={modules}
      placeholder="Write something..."
      className="flex min-w-[90%] flex-col rounded-md border p-2 font-noto"
    />
  );
};

export default QuillEditor;
