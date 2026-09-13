import { DocumentRenderer } from "@keystatic/core/renderer";
import Image from "next/image";

import { type Post } from "@/lib/api";

export function Markdown({ content }: { content: Post["content"] }) {
  if (!content) {
    return null;
  }

  let paragraphIndex = 0;

  return (
    <div className="[&_a]:underline [&_a:hover]:text-accent [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6">
      <DocumentRenderer
        document={content}
        renderers={{
          block: {
            paragraph: ({ children }) => {
              const isLead = paragraphIndex === 0;
              paragraphIndex += 1;
              return isLead ? (
                <p className="mb-7 text-[19px] leading-[1.7] text-ink-80 text-pretty">
                  {children}
                </p>
              ) : (
                <p className="mb-6 text-lg leading-[1.75] text-body text-pretty">
                  {children}
                </p>
              );
            },
            heading: ({ children }) => (
              <h2 className="mt-11 mb-4 text-2xl leading-[1.2] font-extrabold tracking-[-0.03em]">
                {children}
              </h2>
            ),
            blockquote: ({ children }) => (
              <blockquote className="my-9 border-l-2 border-accent py-0 pl-6 text-xl leading-[1.55] font-medium text-ink-80">
                {children}
              </blockquote>
            ),
            image: ({ src, alt }) => (
              <Image
                src={src}
                alt={alt || ""}
                width={1400}
                height={800}
                className="my-9 h-auto w-full"
              />
            ),
          },
        }}
      />
    </div>
  );
}
