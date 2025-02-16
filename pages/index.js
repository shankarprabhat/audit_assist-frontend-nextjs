import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import UserTable from '../components/UserTable';
import PdfPreview from '../components/PdfPreview';

export default function Home() {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [complianceData, setComplianceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleViewCompliance = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/compliance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Or send data if needed
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${response.status} - ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      setComplianceData(JSON.parse(data)); // Parse JSON string
    } catch (err) {
      console.error('Error fetching compliance data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navigation />

      <main className="container mx-auto p-8">
        {/* ... (Welcome message and title) ... */}

        <div className="mt-16 text-center"> {/* Improved spacing and centering */}
        <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl leading-tight"> {/* Larger, bolder text */}
            Welcome to Audit Assist
        </h2>
        <p className="mt-6 text-xl text-gray-700 max-w-3xl mx-auto"> {/* Added paragraph styling */}
            We specialize in providing deep insights into audit documents using AI and Data-driven models.
        </p>
        </div>   

        <div> {/* Added a wrapping div */}
            <h3 className="text-xl font-semibold mb-4"> {/* Added the heading */}
              Reference and Training Records found for Clintas Solution:
            </h3>
        </div> {/* Added a wrapping div */}

        <div className="mt-8 flex">
          <div className="w-1/2">
            <UserTable onSelectPdf={setSelectedPdf} />
          </div>
          <div className="w-1/2 ml-8">
            <PdfPreview pdf={selectedPdf} />
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleViewCompliance}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'View Compliance'}
          </button>
        </div>

        {/* Compliance Table (Pure Next.js) */}
        {loading && <p>Loading compliance data...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {complianceData && complianceData.length > 0 && (
          <table className="w-full border-collapse table-auto mt-4">
            <thead>
              <tr>
                {Object.keys(complianceData[0]).map((key) => (
                  <th key={key} className="px-4 py-2 text-left border">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {complianceData.map((row, index) => (
                <tr key={index}>
                  {Object.keys(row).map((key) => (
                    <td key={key} className="px-4 py-2 border">
                      {row[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {complianceData && complianceData.length === 0 && (
          <p>No compliance data available.</p>
        )}
      </main>
    </div>
  );
}