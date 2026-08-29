import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";

import { type Asset, type Post } from "@/lib/generated/contentful-types";

function RichTextAsset({ id, assets }: { id: string; assets: Asset[] }) {
  const asset = assets.find((asset) => asset.sys.id === id);

  if (asset?.url) {
    return (
      <Image src={asset.url} layout="fill" alt={asset.description || ""} />
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

  return documentToReactComponents(content.json, {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => (
        <RichTextAsset id={node.data.target.sys.id} assets={assets} />
      ),
    },
  });
}
