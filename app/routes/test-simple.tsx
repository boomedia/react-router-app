import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function TestPropertyDetails() {
  const { id } = useParams();
  const [status, setStatus] = useState('initializing');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setStatus('starting fetch');
      
      try {
        setStatus('fetching...');
        const response = await fetch(`https://cms.hassen.com.au/api/properties/${id}?depth=2&draft=false&locale=undefined`);
        
        setStatus(`response received: ${response.status}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        setStatus('success');
        setData(result);
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Test Property {id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>Status:</strong> {status}
            </div>
            
            {error && (
              <div className="text-red-600">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            {data && (
              <div>
                <strong>Property Name:</strong> {data.name}
              </div>
            )}
            
            <div>
              <Link to="/properties">
                <Button>Back to Properties</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
