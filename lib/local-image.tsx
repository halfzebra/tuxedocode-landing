"use client";

import Image from "next/image";

interface LocalImageProps {
  src: string;
  alt: string;
  [key: string]: any;
}

const localLoader = ({ src }: { src: string }) => src;

export default function LocalImage(props: LocalImageProps) {
  return <Image loader={localLoader} unoptimized {...props} />;
}
