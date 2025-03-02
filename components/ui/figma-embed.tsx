interface FigmaEmbedProps {
  embedUrl: string;
  title?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function FigmaEmbed({ 
  embedUrl, 
  title = "Figma Prototype", 
  className = "",
  width = "800",
  height = "450"
}: FigmaEmbedProps) {
  // Ensure the URL is a valid Figma embed URL
  const isValidFigmaUrl = (url: string) => {
    return url.startsWith('https://www.figma.com/embed') || 
           url.startsWith('https://embed.figma.com') ||
           url.startsWith('https://www.figma.com/file') || 
           url.startsWith('https://www.figma.com/proto');
  };

  // Convert regular Figma URLs to embed URLs if needed
  const getEmbedUrl = (url: string) => {
    if (url.startsWith('https://www.figma.com/embed') || url.startsWith('https://embed.figma.com')) {
      return url;
    }

    // Convert file URLs
    if (url.includes('/file/')) {
      return url.replace('https://www.figma.com/file/', 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/');
    }

    // Convert prototype URLs
    if (url.includes('/proto/')) {
      return url.replace('https://www.figma.com/proto/', 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/proto/');
    }

    return url;
  };

  const finalUrl = getEmbedUrl(embedUrl);

  if (!isValidFigmaUrl(embedUrl)) {
    return (
      <div className="border border-red-300 bg-red-50 p-4 rounded-md">
        <p className="text-red-600">Invalid Figma URL. Please provide a valid Figma file or prototype URL.</p>
      </div>
    );
  }

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <iframe
        title={title}
        width={width}
        height={height}
        src={finalUrl}
        allowFullScreen
        style={{ border: "1px solid rgba(0, 0, 0, 0.1)" }}
      />
    </div>
  );
} 