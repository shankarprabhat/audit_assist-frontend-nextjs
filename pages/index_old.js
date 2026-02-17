import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import UserTable from '../components/UserTable';
import PdfPreview from '../components/PdfPreview';
import * as XLSX from 'xlsx'; // Import xlsx
import Logo from '../components/Logo'; // Adjust the path as needed

export default function Home() {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [complianceData, setComplianceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Audit Insights'); // Added state for active tab
  const [excelData, setExcelData] = useState(null);
  const [reportData, setReportData] = useState(null);
  
  // New state variables for Audit Insights form
  const [auditObservations, setAuditObservations] = useState('');
  const [regulatoryGuideline, setRegulatoryGuideline] = useState('');
  const [regulatoryContentId, setRegulatoryContentId] = useState('');
  const [protocolGuideline, setProtocolGuideline] = useState('');
  const [protocolContentId, setProtocolContentId] = useState('');
  const [auditFindings, setAuditFindings] = useState(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState(null);

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

  const handleGenerateAuditFindings = async () => {
    setAuditLoading(true);
    setAuditError(null);
    setAuditFindings(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://zzqi5gvfxr.ap-south-1.awsapprunner.com';
      // const payload = {
      //   auditObservation: auditObservations || undefined,
      //   manualContext['regulatoryGuideline']['documentId']: regulatoryGuideline || undefined,
      //   manualContext['protocolGuideline']['documentId']: protocolGuideline || undefined,
      //   // regulatoryGuideline: regulatoryGuideline || undefined,
      //   // regulatoryContentId: regulatoryContentId || undefined,
      //   // protocolGuideline: protocolGuideline || undefined,
      //   // protocolContentId: protocolContentId || undefined,
      // };

      const payload = {
        auditObservation: auditObservations || undefined,
        // gxpCategories: gxpCategories || [], // Assuming gxpCategories is an array

        // Create the 'manualContext' object
        manualContext: {          
          // Create the 'regulatoryGuideline' object inside manualContext
          regulatoryGuideline: {
            documentId: regulatoryGuideline || "", // Using your variable
            sectionId: "", // Hardcoded as per your example
            subsectionId: "", // Hardcoded as per your example
            contentId: regulatoryContentId || "", // From your commented code
          },

          // Create the 'protocolGuideline' object inside manualContext
          protocolGuideline: {
            documentId: protocolGuideline || "", // Using your variable
            sectionId: "", // Hardcoded as per your example
            subsectionId: "", // Hardcoded as per your example
            contentId: protocolContentId || "", // From your commented code
            },
          },
        };

      const response = await fetch(`${baseUrl}/generate-audit-findings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Validation Error:", errorData);
        throw new Error(`${response.status} - ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      setAuditFindings(data);
    } catch (err) {
      console.error('Error generating audit findings:', err);
      setAuditError(err.message);
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <div>
      <Navigation />

      <main className="container mx-auto p-8">
        <div className="mt-16 text-center">
        <Logo />
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
          <div className="mt-8">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-4">
                Generate Audit Findings
              </h3>
              <p className="text-gray-600">Enter your audit observations and select guidelines to generate AI-powered findings.</p>
            </div>

            {/* Form Section */}
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
              {/* Audit Observations Text Field */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="auditObservations">
                  Audit Observations *
                </label>
                <textarea
                  id="auditObservations"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your audit observations here..."
                  rows="6"
                  value={auditObservations}
                  onChange={(e) => setAuditObservations(e.target.value)}
                />
              </div>

              {/* Regulatory Guideline Section */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">Regulatory Guideline</h4>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="regulatoryGuideline">
                      Guideline
                    </label>
                    <select
                      id="regulatoryGuideline"
                      className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={regulatoryGuideline}
                      onChange={(e) => setRegulatoryGuideline(e.target.value)}
                    >
                      <option value="">Select a guideline</option>
                      <option value="21 CFR Part 50">21 CFR Part 50</option>
                      <option value="21 CFR Part 312">21 CFR Part 312</option>
                      <option value="21 CFR Part 56">21 CFR Part 56</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="regulatoryContentId">
                      Content ID (Optional)
                    </label>
                    <input
                      id="regulatoryContentId"
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Enter content ID"
                      value={regulatoryContentId}
                      onChange={(e) => setRegulatoryContentId(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Protocol Guideline Section */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">Protocol Guideline</h4>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="protocolGuideline">
                      Guideline
                    </label>
                    <select
                      id="protocolGuideline"
                      className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={protocolGuideline}
                      onChange={(e) => setProtocolGuideline(e.target.value)}
                    >
                      <option value="">Select a guideline</option>
                      <option value="21 CFR Part 50">21 CFR Part 50</option>
                      <option value="21 CFR Part 312">21 CFR Part 312</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="protocolContentId">
                      Content ID (Optional)
                    </label>
                    <input
                      id="protocolContentId"
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Enter content ID"
                      value={protocolContentId}
                      onChange={(e) => setProtocolContentId(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex items-center justify-center">
                <button
                  onClick={handleGenerateAuditFindings}
                  disabled={!auditObservations || auditLoading}
                  className={`${
                    !auditObservations || auditLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-700'
                  } text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline`}
                >
                  {auditLoading ? 'Generating...' : 'Generate Audit Findings'}
                </button>
              </div>
            </div>

            {/* Error Display */}
            {auditError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                <strong className="font-bold">Error: </strong>
                <span>{auditError}</span>
              </div>
            )}

            {/* Results Section */}
            {auditFindings && (
              <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-6">Results</h3>
                
                {/* AI Generated Finding */}
                <div className="mb-6 bg-white shadow-md rounded px-8 pt-6 pb-8">
                  <h4 className="text-lg font-semibold mb-3 text-gray-800">AI Generated Finding</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{auditFindings.aiGeneratedFinding}</p>
                  </div>
                </div>

                {/* Fetched Context */}
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
                  <h4 className="text-lg font-semibold mb-3 text-gray-800">Fetched Context</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{auditFindings.fetchedContext}</p>
                  </div>
                </div>
              </div>
            )}
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
