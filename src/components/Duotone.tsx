import Image, { type ImageProps } from "next/image";

/**
 * Unified LIT photo treatment: greyscale photo tinted with charcoal shadows and
 * flame highlights, so mixed-quality phone photos look like one family.
 */
export function Duotone({
  tone = "flame",
  className = "",
  imgClassName = "",
  ...img
}: ImageProps & { tone?: "flame" | "green"; imgClassName?: string }) {
  const highlight = tone === "flame" ? "bg-flame" : "bg-lit-green";
  return (
    <div className={`relative isolate overflow-hidden bg-charcoal ${className}`}>
      <Image {...img} alt={img.alt} className={`object-cover grayscale contrast-125 ${imgClassName}`} />
      {/* highlights take the brand colour, shadows stay charcoal */}
      <div aria-hidden className={`absolute inset-0 ${highlight} mix-blend-multiply`} />
      <div aria-hidden className="absolute inset-0 bg-charcoal mix-blend-lighten" />
    </div>
  );
}
