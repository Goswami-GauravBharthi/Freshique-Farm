import { useMemo } from "react";

// Utility: Convert \r\n → <br> and wrap headings in <strong>
const formatDescription = (text:string) => {
  if (!text) return "";

  return text
    .replace(/\r\n\r\n/g, '</p><p class="mt-4">') // Paragraph spacing
    .replace(/\r\n/g, "<br>") // Line breaks
    .replace(/^(.*?):/gm, '<strong class="text-green-700">$1:</strong>') // Bold headings
    .replace(
      /^•/gm,
      '<span class="inline-block w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>'
    ) // Bullets
    .trim();
};

interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({
  description,
}: ProductDescriptionProps) {
  const formattedHTML = useMemo(() => {
    const withParagraphs = `<p>${formatDescription(description)}</p>`;
    return withParagraphs;
  }, [description]);

  return (
    <div className="prose prose-sm md:prose-base max-w-none text-gray-700">
      <div
        dangerouslySetInnerHTML={{ __html: formattedHTML }}
        className="leading-relaxed"
      />
    </div>
  );
}