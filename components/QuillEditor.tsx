// QuillEditor.tsx

import { FC } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles

interface QuillEditorProps {
  content: string;
  setContent: (content: string) => void;
}

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

  return (
    <ReactQuill
      theme="snow"
      value={content}
      onChange={setContent}
      modules={modules}
      className="mb-4 rounded-md border p-2"
    />
  );
};

export default QuillEditor;
