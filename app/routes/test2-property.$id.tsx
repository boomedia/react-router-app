import { useParams, Link, useLoaderData } from "react-router";
import { useState } from "react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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

export default function EnhancedPropertyDetails() {
  const { property, error } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'due-diligence' | 'comparables'>('overview');

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Error Loading Property</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/properties">
            <Button>Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Property Not Found</h1>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
          <Link to="/properties">
            <Button>Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
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

  const fullAddress = `${property.generalInformation.address.streetAddress}, ${property.generalInformation.address.postcode} ${property.generalInformation.address.state?.toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <nav className="text-sm text-gray-500">
              <Link to="/properties" className="hover:text-gray-700 transition-colors">
                Properties
              </Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900 font-medium">{property.name}</span>
            </nav>
            <Link to="/properties">
              <Button variant="outline" size="sm">
                ← Back to Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        {property.generalInformation.heroImage ? (
          <img
            src={getImageUrl(property.generalInformation.heroImage.url)}
            alt={property.generalInformation.heroImage.alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-lg">No image available</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{property.name}</h1>
            <p className="text-xl text-gray-200 mb-4">{fullAddress}</p>
            <div className="flex flex-wrap items-center gap-6 text-white">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span className="text-lg font-semibold">{property.generalInformation.format.bedrooms} Bed</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-semibold">{property.generalInformation.format.bathrooms} Bath</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 002 0V6.414l1.293 1.293a1 1 0 001.414-1.414L3.414 3.586A1 1 0 003 4zM17 4a1 1 0 011 1v10a1 1 0 11-2 0V6.414l-1.293 1.293a1 1 0 01-1.414-1.414L16.586 3.586A1 1 0 0117 4z" />
                </svg>
                <span className="text-lg font-semibold">{property.generalInformation.format.carSpaces} Car</span>
              </div>
              <div className="text-3xl font-bold">{formatPrice(property.generalInformation.purchasePrice)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'financials', label: 'Financials' },
              { key: 'due-diligence', label: 'Due Diligence' },
              { key: 'comparables', label: 'Comparables' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Property Details */}
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardTitle className="text-2xl text-gray-900">Property Details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {property.generalInformation.format.bedrooms}
                        </div>
                        <div className="text-sm text-gray-600 uppercase tracking-wide">Bedrooms</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {property.generalInformation.format.bathrooms}
                        </div>
                        <div className="text-sm text-gray-600 uppercase tracking-wide">Bathrooms</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {property.generalInformation.format.carSpaces}
                        </div>
                        <div className="text-sm text-gray-600 uppercase tracking-wide">Car Spaces</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {property.generalInformation.buildYear}
                        </div>
                        <div className="text-sm text-gray-600 uppercase tracking-wide">Built</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Land Size</div>
                          <div className="text-gray-600">{property.generalInformation.land} m²</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Internal Size</div>
                          <div className="text-gray-600">{property.generalInformation.internal} m²</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-3 text-gray-900">Agent Summary</h4>
                      <div className="text-gray-700 leading-relaxed text-base">
                        {renderRichText(property.generalInformation.agentSummary)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'financials' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    Financial Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {/* Purchase Costs */}
                    <div>
                      <h4 className="font-semibold text-lg mb-4 text-gray-900 border-b pb-2">Purchase Costs</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Purchase Price</span>
                          <span className="font-semibold text-lg">{formatPrice(property.generalInformation.purchasePrice)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Deposit Cash</span>
                          <span className="font-semibold">{formatPrice(property.valueProposition.purchaseCost.depositCash)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Equity Release</span>
                          <span className="font-semibold">{formatPrice(property.valueProposition.purchaseCost.equityRelease)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Stamp Duty</span>
                          <span className="font-semibold">{formatPrice(property.valueProposition.purchaseCost.stampDuty)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Renovations</span>
                          <span className="font-semibold">{formatPrice(property.valueProposition.purchaseCost.renovationsCost)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Building & Pest</span>
                          <span className="font-semibold">{formatPrice(property.valueProposition.purchaseCost.buildingAndPest)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Annual Expenses */}
                    <div>
                      <h4 className="font-semibold text-lg mb-4 text-gray-900 border-b pb-2">Annual Expenses</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                          <span className="text-gray-600">Council Rates</span>
                          <span className="font-semibold">{formatPrice(property.valueProposition.annualExpenses.councilRates)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                          <span className="text-gray-600">Insurance</span>
                          <span className="font-semibold">{formatPrice(property.valueProposition.annualExpenses.insuranceCosts)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                          <span className="text-gray-600">Utilities</span>
                          <span className="font-semibold">{formatPrice(property.valueProposition.annualExpenses.utilities)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                          <span className="text-gray-600">PM Percentage</span>
                          <span className="font-semibold">{property.valueProposition.annualExpenses.pmPercentage}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Expected Results */}
                    <div>
                      <h4 className="font-semibold text-lg mb-4 text-gray-900 border-b pb-2">Expected Results</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span className="text-gray-600">Expected Weekly Rent</span>
                          <span className="font-semibold">${property.valueProposition.expectedResults.expectedWeeklyRent}/week</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span className="text-gray-600">Depreciation Potential</span>
                          <span className="font-semibold">{formatPrice(property.valueProposition.expectedResults.depreciationPotential)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'due-diligence' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Due Diligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {property.dueDiligence.zoneData.map((zone: any) => (
                      <div key={zone.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <img
                            src={getImageUrl(zone.image.url)}
                            alt={zone.image.alt}
                            className="w-full h-48 object-cover"
                          />
                          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                            zone.effected === 'no' ? 'bg-green-500 text-white' : 
                            zone.effected === 'partial' ? 'bg-yellow-500 text-white' : 
                            'bg-red-500 text-white'
                          }`}>
                            {zone.effected.toUpperCase()}
                          </div>
                        </div>
                        <div className="p-4">
                          <h5 className="font-semibold text-lg capitalize mb-2 text-gray-900">{zone.type}</h5>
                          <p className="text-sm text-gray-600 mb-3">{zone.details}</p>
                          {zone.agentNotes && (
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-3">
                              <p className="text-sm text-blue-700">
                                <strong>Agent Note:</strong> {zone.agentNotes}
                              </p>
                            </div>
                          )}
                          {zone.url && (
                            <a
                              href={zone.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              More Info
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'comparables' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Comparable Sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {property.generalInformation.comparableSales.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {property.generalInformation.comparableSales.map((sale: any) => (
                        <div key={sale.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          <img
                            src={getImageUrl(sale.heroImage.url)}
                            alt={sale.heroImage.alt}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h5 className="font-semibold text-lg mb-2 text-gray-900">{sale.address}</h5>
                            <div className="text-2xl font-bold text-green-600 mb-3">{formatPrice(sale.salePrice)}</div>
                            <a
                              href={sale.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                              View Listing
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <p className="text-gray-500">No comparable sales available for this property.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="sticky top-24">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="text-xl text-gray-900">Investment Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="text-center border-b pb-6">
                  <div className="text-sm text-gray-500 mb-1">Purchase Price</div>
                  <div className="text-3xl font-bold text-green-600">
                    {formatPrice(property.generalInformation.purchasePrice)}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Asking Price</span>
                    <span className="font-semibold">{formatPrice(property.generalInformation.askingPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Rent</span>
                    <span className="font-semibold">${property.dueDiligence.currentWeeklyRent}/week</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Expected Rent</span>
                    <span className="font-semibold text-green-600">${property.valueProposition.expectedResults.expectedWeeklyRent}/week</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="text-sm text-gray-600 mb-2">Occupancy Status</div>
                  <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    property.dueDiligence.propertyOccupancy === 'occupied' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {property.dueDiligence.propertyOccupancy.charAt(0).toUpperCase() + property.dueDiligence.propertyOccupancy.slice(1)}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Lease Expiry</div>
                  <div className="font-semibold">{formatDate(property.dueDiligence.leaseExpiryDate)}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
