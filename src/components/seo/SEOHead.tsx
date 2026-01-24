import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
  structuredData?: object;
}

/**
 * SEO Head component for managing page-specific meta tags
 * Uses react-helmet-async for dynamic head management
 */
export const SEOHead = ({
  title = "Migrei | Transição de Carreira em 6 Fases",
  description = "Descubra o Ciclo Migrei: método estruturado em 6 fases para transição de carreira com clareza. 87% relatam mais clareza em 30 dias.",
  canonical,
  ogImage = "https://migrei.com/og-image.png",
  ogType = "website",
  noIndex = false,
  structuredData,
}: SEOHeadProps) => {
  const fullTitle = title.includes("Migrei") ? title : `${title} | Migrei`;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      {canonical && <meta property="og:url" content={canonical} />}
      
      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
