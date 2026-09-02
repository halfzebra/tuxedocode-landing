import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";

import Image from "next/image";
import { type Asset, type Post } from "@/lib/generated/contentful-types";

function RichTextAsset({ id, assets }: { id: string; assets: Asset[] }) {
  const asset = assets.find((asset) => asset.sys.id === id);

  if (asset?.url) {
    return (
      <Image
        src={asset.url}
        alt={asset.description || ""}
        width={1400}
        height={800}
        className="my-9 h-auto w-full"
      />
    );
  }

  return null;
}

export function Markdown({ content }: { content: Post["content"] }) {
  if (!content) {
    return null;
  }

  const assets = content.links.assets.block.filter(
    (asset): asset is Asset => Boolean(asset)
  );

  let paragraphIndex = 0;

  return (
    <div className="[&_a]:underline [&_a:hover]:text-accent [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6">
      {documentToReactComponents(content.json, {
        renderNode: {
          [BLOCKS.PARAGRAPH]: (_node, children) => {
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
          [BLOCKS.HEADING_2]: (_node, children) => (
            <h2 className="mt-11 mb-4 text-2xl leading-[1.2] font-extrabold tracking-[-0.03em]">
              {children}
            </h2>
          ),
          [BLOCKS.QUOTE]: (_node, children) => (
            <blockquote className="my-9 border-l-2 border-accent py-0 pl-6 text-xl leading-[1.55] font-medium text-ink-80">
              {children}
            </blockquote>
          ),
          [BLOCKS.EMBEDDED_ASSET]: (node: any) => (
            <RichTextAsset id={node.data.target.sys.id} assets={assets} />
          ),
        },
      })}
    </div>
  );
}
