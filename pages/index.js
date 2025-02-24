import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import UserTable from '../components/UserTable';
import PdfPreview from '../components/PdfPreview';
import * as XLSX from 'xlsx'; // Import xlsx

export default function Home() {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [complianceData, setComplianceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Audit Insights'); // Added state for active tab
  const [excelData, setExcelData] = useState(null);
  const [reportData, setReportData] = useState(null);

  const handleViewCompliance = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Get the API URL from environment
      const response = await fetch(apiUrl, {
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

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    console.log(tabName); //Verify the tab name is changing
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0]; // Get the first sheet name
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convert to JSON

      setExcelData(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleGenerateReport = async () => {  
    try {
      const response = await fetch('/docs/Audit Observations-Output.xlsx'); // Fetch the Excel file
      const data = await response.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      setReportData(jsonData);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div>
      <Navigation />

      <main className="container mx-auto p-8">
        <div className="mt-16 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl leading-tight">
            Welcome to Audit Assist
          </h2>
          <p className="mt-6 text-xl text-gray-700 max-w-3xl mx-auto">
            AI Driven Insights into Documents and Data!.
          </p>
        </div>

        {/* Vertical Tabs */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => handleTabClick('Audit Insights')}
            className={`px-4 py-2 rounded-l ${
              activeTab === 'Audit Insights' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Audit Insights
          </button>

          <button
            onClick={() => handleTabClick('Training Insights')}
            className={`px-4 py-2 rounded-r ${
              activeTab === 'Training Insights' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Training Insights
          </button>
        </div>

        {/* Content based on active tab */}        
        {activeTab === 'Audit Insights' && (
          <div>
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Generate Audit Reports based on Auditors Observations!
              </h3>
              <h4>Please Share the Auditors Observations</h4>
            </div>

            <div className="flex items-center">
              <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
              <button
                onClick={handleGenerateReport}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
              >
                Generate Report
              </button>
            </div>
            
            <div className="flex mt-4"> {/* Split screen */}
              <div className="w-1/2 pr-4"> {/* Left side */}
                {excelData && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">Excel Preview:</h4>
                    <table className="w-full border-collapse table-auto">
                      <tbody>
                        {excelData.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="border px-4 py-2">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
              <div className="w-1/2 pl-4"> {/* Right side */}  
                {reportData && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">Generated Report:</h4>
                    <table className="w-full border-collapse table-auto">
                      <tbody>
                        {reportData.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="border px-4 py-2">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Training Insights' && (
          <div>
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Reference and Training Records found for Clintas Solution:
              </h3>
            </div>
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

          {/* Compliance Data */}

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
          </div>       
        )}
      </main>
    </div>
  );
}