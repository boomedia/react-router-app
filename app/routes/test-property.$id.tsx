import { useParams, Link, useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import type { LoaderFunctionArgs } from "react-router";

// Server-side loader function to fetch data (bypasses CORS)
export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  
  try {
    const response = await fetch(`https://cms.hassen.com.au/api/properties/${id}?depth=2&draft=false&locale=undefined`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const property = await response.json();
    return { property, error: null };
  } catch (error) {
    return { 
      property: null, 
      error: error instanceof Error ? error.message : 'Failed to fetch property'
    };
  }
}

interface PropertyApiResponse {
  id: number;
  name: string;
  generalInformation: {
    heroImage: {
      id: number;
      alt: string;
      url: string;
      thumbnailURL: string | null;
      filename: string;
      mimeType: string;
      filesize: number;
      width: number;
      height: number;
      focalX: number;
      focalY: number;
      updatedAt: string;
      createdAt: string;
    };
    agentNotes: Array<{
      id: string;
      agentName: string;
      agentNote: string;
    }>;
    agentSummary: any;
    videoUrl: string | null;
    presentationUrl: string | null;
    purchasePrice: number;
    askingPrice: number;
    address: {
      streetAddress: string;
      suburbName: string | null;
      region: string | null;
      postcode: string;
      state: string;
    };
    saleHistory: any[];
    format: {
      bedrooms: number;
      bathrooms: number;
      carSpaces: number;
    };
    internal: number;
    land: number;
    buildYear: number;
    images: any[];
    comparableSales: Array<{
      id: string;
      address: string;
      salePrice: number;
      link: string;
      heroImage: {
        id: number;
        alt: string;
        url: string;
        thumbnailURL: string | null;
        filename: string;
        mimeType: string;
        filesize: number;
        width: number;
        height: number;
        focalX: number;
        focalY: number;
        updatedAt: string;
        createdAt: string;
      };
    }>;
  };
  dueDiligence: {
    zoneData: Array<{
      id: string;
      type: string;
      effected: string;
      details: string;
      agentNotes: string | null;
      url: string | null;
      image: {
        id: number;
        alt: string;
        url: string;
        thumbnailURL: string | null;
        filename: string;
        mimeType: string;
        filesize: number;
        width: number;
        height: number;
        focalX: number;
        focalY: number;
        updatedAt: string;
        createdAt: string;
      };
    }>;
    propertyOccupancy: string;
    leaseExpiryDate: string;
    lastRentalIncrease: string;
    currentWeeklyRent: number;
  };
  valueProposition: {
    purchaseCost: {
      purchasePriceDisplay: string | null;
      loanTerm: number;
      loanAmountDisplay: string | null;
      interestRate: number;
      depositCash: number;
      equityRelease: number;
      equityReleaseInterestRate: number;
      depositTotalDisplay: string | null;
      depositPercentageDisplay: string | null;
      stampDuty: number;
      renovationsCost: number;
      buildingAndPest: number;
      conveyancing: number;
      bankFees: number;
      lendersMortgageInsurance: number;
      totalPurchaseCostDisplay: string | null;
    };
    annualExpenses: {
      councilRates: number;
      insuranceCosts: number;
      utilities: number;
      pmPercentage: number;
      pmFeesDisplay: string | null;
      repairsAndMaintenance: number;
      loanRepaymentsDisp: string | null;
      totalExpensesDisp: string | null;
    };
    expectedResults: {
      expectedWeeklyRent: number;
      annualGrossIncomeDisplay: string | null;
      annualGrossYieldDisplay: string | null;
      annualNetIncomeDisplay: string | null;
      annualNetYieldDisplay: string | null;
      depreciationPotential: number;
      equityAt8Display: string | null;
      equityAt10Display: string | null;
      equityAt12Display: string | null;
      equityAt16Display: string | null;
    };
  };
  updatedAt: string;
  createdAt: string;
}

export default function TestPropertyDetails() {
  const { property, error } = useLoaderData<typeof loader>();
  const [debugInfo] = useState<string[]>(['Server-side fetch completed successfully']);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode !== null) {
      setIsDarkMode(savedMode === 'true');
    } else {
      setIsDarkMode(systemPrefersDark);
    }
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-destructive">Error Loading Property</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link to="/properties">
            <Button>Back to Properties</Button>
          </Link>
          <div className="mt-6 text-left max-w-2xl mx-auto">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <div className="bg-muted p-4 rounded text-sm">
              <div>Server-side fetch failed</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The property you're looking for doesn't exist.
          </p>
          <Link to="/properties">
            <Button>Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://cms.hassen.com.au${url}`;
  };

  // Function to render rich text (lexical editor) format as HTML
  const renderRichText = (richTextObj: any): React.ReactNode => {
    if (!richTextObj || !richTextObj.root || !richTextObj.root.children) {
      return null;
    }

    const renderNode = (node: any, index: number): React.ReactNode => {
      if (node.type === 'text') {
        let text = node.text || '';
        
        // Apply text formatting
        if (node.format & 1) text = <strong key={index}>{text}</strong>; // Bold
        if (node.format & 2) text = <em key={index}>{text}</em>; // Italic
        if (node.format & 8) text = <u key={index}>{text}</u>; // Underline
        if (node.format & 16) text = <s key={index}>{text}</s>; // Strikethrough
        
        return text;
      }

      if (node.type === 'paragraph') {
        const children = node.children ? node.children.map(renderNode) : [];
        return (
          <p key={index} className="mb-4 last:mb-0">
            {children}
          </p>
        );
      }

      if (node.type === 'heading') {
        const children = node.children ? node.children.map(renderNode) : [];
        const HeadingTag = node.tag || 'h2';
        
        const headingClasses = {
          h1: 'text-3xl font-bold mb-4',
          h2: 'text-2xl font-bold mb-3',
          h3: 'text-xl font-bold mb-3',
          h4: 'text-lg font-bold mb-2',
          h5: 'text-base font-bold mb-2',
          h6: 'text-sm font-bold mb-2'
        };

        return React.createElement(
          HeadingTag,
          { 
            key: index, 
            className: headingClasses[HeadingTag as keyof typeof headingClasses] || headingClasses.h2 
          },
          children
        );
      }

      if (node.type === 'list') {
        const children = node.children ? node.children.map(renderNode) : [];
        const ListTag = node.listType === 'number' ? 'ol' : 'ul';
        return (
          <ListTag key={index} className="list-disc list-inside mb-4 space-y-1">
            {children}
          </ListTag>
        );
      }

      if (node.type === 'listitem') {
        const children = node.children ? node.children.map(renderNode) : [];
        return (
          <li key={index} className="ml-4">
            {children}
          </li>
        );
      }

      if (node.type === 'link') {
        const children = node.children ? node.children.map(renderNode) : [];
        return (
          <a 
            key={index} 
            href={node.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {children}
          </a>
        );
      }

      // Handle line breaks
      if (node.type === 'linebreak') {
        return <br key={index} />;
      }

      // Fallback for unknown types - render children if they exist
      if (node.children) {
        return (
          <div key={index}>
            {node.children.map(renderNode)}
          </div>
        );
      }

      return null;
    };

    return (
      <div className="rich-text-content">
        {richTextObj.root.children.map(renderNode)}
      </div>
    );
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Convert Loom share URLs to embed URLs
    const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
    if (loomMatch) {
      return `https://www.loom.com/embed/${loomMatch[1]}`;
    }
    
    // Convert YouTube watch URLs to embed URLs
    const youtubeMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // Convert YouTube short URLs to embed URLs
    const youtubeShortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (youtubeShortMatch) {
      return `https://www.youtube.com/embed/${youtubeShortMatch[1]}`;
    }
    
    // Convert Vimeo URLs to embed URLs
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    // If it's already an embed URL or unknown format, return as-is
    return url;
  };

  const fullAddress = `${property.generalInformation.address.streetAddress}, ${property.generalInformation.address.postcode} ${property.generalInformation.address.state?.toUpperCase()}`;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Breadcrumb and Dark Mode Toggle */}
      <div className="mb-6 flex items-center justify-between">
        <nav className="text-sm text-muted-foreground">
          <Link to="/properties" className="hover:text-foreground">
            Properties
          </Link>
          <span className="mx-2">›</span>
          <span>{property.name}</span>
        </nav>
        
        {/* Dark Mode Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleDarkMode}
          className="flex items-center gap-2"
        >
          {isDarkMode ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Light
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              Dark
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image */}
          <h1 className="text-2xl md:text-5xl">{fullAddress}</h1>
          <Card className="overflow-hidden p-0 mb-0">
            <div className="relative">
              {property.generalInformation.heroImage ? (
                <img
                  src={getImageUrl(property.generalInformation.heroImage.url)}
                  alt={property.generalInformation.heroImage.alt}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No image available</span>
                </div>
              )}
            </div>
          </Card>

          {/* Pricing */}
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Purchase Price</div>
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(property.generalInformation.purchasePrice)}
                  </div>
                </div>
                <div className="text-center text-2xl border-l pl-6 border-muted">|</div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Asking Price</div>
                  <div className="text-xl font-semibold">
                    {formatPrice(property.generalInformation.askingPrice)}
                  </div>
                </div>
              </div>
            {/* Property Details */}
            <div className="grid grid-cols-3 gap-1 md:gap-6 pt-6">
                <div className="flex items-center gap-4 py-2 md:py-0 px-2 border-0 md:border rounded-lg bg-card hover:shadow-md transition-shadow">
                  <div className="w-6 h-6 md:w-12 md:h-12 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bed-icon lucide-bed"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{property.generalInformation.format.bedrooms} <span className="text-sm text-muted-foreground hidden md:inline">Bedrooms</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-4 py-2 md:py-0 px-2 border-0 md:border rounded-lg bg-card hover:shadow-md transition-shadow">
                  <div className="w-6 h-6 md:w-12 md:h-12 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bath-icon lucide-bath"><path d="M10 4 8 6"/><path d="M17 19v2"/><path d="M2 12h20"/><path d="M7 19v2"/><path d="M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/></svg>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{property.generalInformation.format.bathrooms} <span className="text-sm text-muted-foreground hidden md:inline">Bathrooms</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-4 py-2 md:py-0 px-2 border-0 md:border rounded-lg bg-card hover:shadow-md transition-shadow">
                  <div className="w-6 h-6 md:w-12 md:h-12 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-car-icon lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{property.generalInformation.format.carSpaces} <span className="text-sm text-muted-foreground hidden md:inline">Car Spaces</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-4 py-2 md:py-0 px-2 border-0 md:border rounded-lg bg-card hover:shadow-md transition-shadow">
                  <div className="w-6 h-6 md:w-12 md:h-12 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{property.generalInformation.buildYear} <span className="text-sm text-muted-foreground hidden md:inline">Built</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-4 py-2 md:py-0 px-2 border-0 md:border rounded-lg bg-card hover:shadow-md transition-shadow">
                  <div className="w-6 h-6 md:w-12 md:h-12 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-land-plot-icon lucide-land-plot"><path d="m12 8 6-3-6-3v10"/><path d="m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12"/><path d="m6.49 12.85 11.02 6.3"/><path d="M17.51 12.85 6.5 19.15"/></svg>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{property.generalInformation.land} m² <span className="text-sm text-muted-foreground hidden md:inline">Land Size</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-4 py-2 md:py-0 px-2 border-0 md:border rounded-lg bg-card hover:shadow-md transition-shadow">
                  <div className="w-6 h-6 md:w-12 md:h-12 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ruler-dimension-line-icon lucide-ruler-dimension-line"><path d="M12 15v-3.014"/><path d="M16 15v-3.014"/><path d="M20 6H4"/><path d="M20 8V4"/><path d="M4 8V4"/><path d="M8 15v-3.014"/><rect x="3" y="12" width="18" height="7" rx="1"/></svg>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{property.generalInformation.internal} m² <span className="text-sm text-muted-foreground hidden md:inline">Internal Size</span></div>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Agent Summary</h4>
                <div className="text-muted-foreground leading-relaxed">
                  {renderRichText(property.generalInformation.agentSummary)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Due Diligence */}
          <Card>
            <CardHeader>
              <CardTitle>Due Diligence</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {property.dueDiligence.zoneData.map((zone: any) => (
                  <AccordionItem key={zone.id} value={zone.id}>
                    <AccordionTrigger className="text-left">
                      <div className="flex justify-between items-center w-full mr-4">
                        <div className="font-medium capitalize">{zone.type}</div>
                        <div className={`text-xs px-2 py-1 rounded ${
                          zone.effected === 'yes' ? 'bg-destructive/10 text-destructive' :
                          zone.effected === 'no' ? 'bg-primary/10 text-primary' : 
                          zone.effected === 'partial' ? 'bg-secondary/30 text-secondary-foreground' : 
                          'bg-destructive/10 text-destructive'
                        }`}>
                          {zone.effected}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {zone.image && (
                          <img
                            src={getImageUrl(zone.image.url)}
                            alt={zone.image.alt}
                            className="w-full h-48 object-cover rounded mb-3"
                          />
                        )}
                        <p className="text-sm text-muted-foreground">{zone.details}</p>
                        {zone.url && (
                          <a
                            href={zone.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center hover:text-primary text-sm font-medium transition-colors"
                          >
                            More Information &nbsp;
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Value Proposition */}
          <Card>
            <CardHeader>
              <CardTitle>Value Proposition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Purchase Costs */}
                <div>
                  <h4 className="font-semibold mb-3">Purchase Costs</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Purchase Price:</span>
                      <span>{formatPrice(property.generalInformation.purchasePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deposit Cash:</span>
                      <span>{formatPrice(property.valueProposition.purchaseCost.depositCash)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Equity Release:</span>
                      <span>{formatPrice(property.valueProposition.purchaseCost.equityRelease)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stamp Duty:</span>
                      <span>{formatPrice(property.valueProposition.purchaseCost.stampDuty)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Renovations:</span>
                      <span>{formatPrice(property.valueProposition.purchaseCost.renovationsCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Building & Pest:</span>
                      <span>{formatPrice(property.valueProposition.purchaseCost.buildingAndPest)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conveyancing:</span>
                      <span>{formatPrice(property.valueProposition.purchaseCost.conveyancing)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank Fees:</span>
                      <span>{formatPrice(property.valueProposition.purchaseCost.bankFees)}</span>
                    </div>
                  </div>
                </div>

                {/* Annual Expenses */}
                <div>
                  <h4 className="font-semibold mb-3">Annual Expenses</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Council Rates:</span>
                      <span>{formatPrice(property.valueProposition.annualExpenses.councilRates)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Insurance:</span>
                      <span>{formatPrice(property.valueProposition.annualExpenses.insuranceCosts)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Utilities:</span>
                      <span>{formatPrice(property.valueProposition.annualExpenses.utilities)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">PM Percentage:</span>
                      <span>{property.valueProposition.annualExpenses.pmPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Repairs & Maintenance:</span>
                      <span>{formatPrice(property.valueProposition.annualExpenses.repairsAndMaintenance)}</span>
                    </div>
                  </div>
                </div>

                {/* Expected Results */}
                <div>
                  <h4 className="font-semibold mb-3">Expected Results</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expected Weekly Rent:</span>
                      <span>${property.valueProposition.expectedResults.expectedWeeklyRent}/week</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Depreciation Potential:</span>
                      <span>{formatPrice(property.valueProposition.expectedResults.depreciationPotential)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Your Presentation */}
          {(property.generalInformation.presentationUrl || property.generalInformation.videoUrl) && (
            <Card>

              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex items-center gap-3 p-4 border rounded-lg bg-card hover:shadow-md hover:border-primary transition-all cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold">Your Presentation</div>
                        <div className="text-sm text-muted-foreground">Click to view video</div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl overflow-hidden">
                    <DialogHeader>
                      <DialogTitle>Property Presentation</DialogTitle>
                    </DialogHeader>
                    <div className="w-full">
                      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                        <iframe 
                          src={getEmbedUrl(property.generalInformation.presentationUrl || property.generalInformation.videoUrl || '')}
                          style={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '100%', 
                            height: '100%' 
                          }}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          onError={() => {
                            console.warn('Video iframe failed to load, likely due to X-Frame-Options');
                          }}
                        />
                      </div>
                      
                      {/* Fallback message and external link */}
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-dashed">
                        <a
                          href={property.generalInformation.presentationUrl || property.generalInformation.videoUrl || ''}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Open video in new tab
                        </a>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}

          {/* Rental Information */}
          <Card>
            <CardHeader>
              <CardTitle>Rental Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Occupancy</div>
                <div className="font-semibold capitalize">
                  {property.dueDiligence.propertyOccupancy}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Current Weekly Rent</div>
                <div className="font-semibold">
                  ${property.dueDiligence.currentWeeklyRent}/week
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Lease Expiry</div>
                <div className="font-semibold">
                  {formatDate(property.dueDiligence.leaseExpiryDate)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Expected Weekly Rent</div>
                <div className="font-semibold">
                  ${property.valueProposition.expectedResults.expectedWeeklyRent}/week
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comparable Sales */}
          {property.generalInformation.comparableSales.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Comparable Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {property.generalInformation.comparableSales.map((sale: any) => (
                    <a
                      key={sale.id}
                      href={sale.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow hover:border-primary cursor-pointer"
                    >
                      <img
                        src={getImageUrl(sale.heroImage.url)}
                        alt={sale.heroImage.alt}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <h5 className="font-semibold text-sm mb-1">{sale.address}</h5>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-primary">{formatPrice(sale.salePrice)}</div>
                          <div className="inline-flex items-center gap-1 hover:text-primary text-xs font-medium transition-colors">
                            View Listing
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Show message if no comparable sales */}
          {property.generalInformation.comparableSales.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Comparable Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="w-12 h-12 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground text-sm">No comparable sales available</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Back to Properties */}
      <div className="mt-8 pt-8 border-t">
        <Link to="/properties">
          <Button variant="outline">
            ← Back to Properties
          </Button>
        </Link>
      </div>
    </div>
  );
}
