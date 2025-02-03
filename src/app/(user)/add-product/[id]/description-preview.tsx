"use client";

import { FormLabel } from "@/components";
import { useState } from "react";
import Markdown from "react-markdown";

const DescriptionPreview = ({
  description,
  children,
}: {
  description?: string;
  children: React.ReactNode;
}) => {
  const [preview, setPreview] = useState(false);
  return (
    <>
      <FormLabel className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPreview(false)}
          className={`${
            !preview ? "underline" : "hover:underline"
          } underline-offset-2 `}
        >
          Description
        </button>
        <button
          type="button"
          onClick={() => setPreview(true)}
          className={`${
            preview ? "underline" : "hover:underline"
          } underline-offset-2 `}
        >
          Preview
        </button>
      </FormLabel>
      {preview && (
        <div className="border p-3 rounded-lg prose">
          <Markdown>
            {description ? description : "No description provided."}
          </Markdown>
        </div>
      )}
      {<div style={{ display: preview ? "none" : "block" }}>{children}</div>}
    </>
  );
};

export default DescriptionPreview;
