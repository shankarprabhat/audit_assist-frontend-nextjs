import { useState } from 'react';
import Navigation from '../components/Navigation';
import UserTable from '../components/UserTable';
import PdfPreview from '../components/PdfPreview';
import * as XLSX from 'xlsx';
import Logo from '../components/Logo';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Audit Observation to Finding');
  
  // States for the new "Audit Observation to Finding" tab
  const [auditObs, setAuditObs] = useState('');
  const [gxpCategory, setGxpCategory] = useState('Good Clinical Practice (GCP)');
  const [manualContext, setManualContext] = useState({
    regulatoryGuideline: { documentId: "", sectionId: "", subsectionId: "", contentId: "" },
    protocolGuideline: { documentId: "", sectionId: "", subsectionId: "", contentId: "" }
  });
  const [findingOutput, setFindingOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Existing states from your previous version
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [complianceData, setComplianceData] = useState(null);
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


  const handleContextChange = (type, field, value) => {
    setManualContext(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
  };

  const handleGenerateFinding = async () => {
    setLoading(true);
    setError(null);
    setFindingOutput(null);

    const payload = {
      auditObservation: auditObs,
      gxpCategories: [gxpCategory],
      manualContext: manualContext
    };

    try {
      // Using your specific AWS URL variable
      const baseUrl = process.env.NEXT_PUBLIC_MY_AWS_URL || 'https://zzqi5gvfxr.ap-south-1.awsapprunner.com';
      const response = await fetch(`${baseUrl}/generate-audit-findings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      
      const data = await response.json();
      // Accessing the nested aiGeneratedFinding based on your JSON structure
      setFindingOutput(data.response?.aiGeneratedFinding || data.aiGeneratedFinding);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navigation />
      <main className="container mx-auto p-8">
        <div className="mt-16 text-center">
          <Logo />
          <h2 className="text-4xl font-extrabold text-gray-900">Audit Assist</h2>
        </div>

        {/* Updated Tab Navigation */}
        <div className="flex justify-center mt-8 mb-10">
          {['Audit Observation to Finding', 'Training Insights'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 border ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Audit Observation to Finding' && (
          <div className="max-w-7xl mx-auto"> 
            {/* Parent Grid Container */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              
              {/* Left Column: Input Form */}
              <div className="bg-white p-6 shadow-lg rounded-lg border">
                <label className="block font-bold mb-2 text-gray-700">Audit Observation</label>
                <textarea 
                  className="w-full p-3 border rounded mb-4 focus:ring-2 focus:ring-blue-500 outline-none" 
                  rows="5"
                  value={auditObs}
                  onChange={(e) => setAuditObs(e.target.value)}
                  placeholder="Enter observation..."
                />

                <label className="block font-bold mb-2 text-gray-700">GxP Category</label>
                <select 
                  className="w-full p-2 border rounded mb-6 bg-white"
                  value={gxpCategory}
                  onChange={(e) => setGxpCategory(e.target.value)}
                >
                  <option>Good Clinical Practice (GCP)</option>
                  <option>Data Integrity</option>
                  <option>Good Manufacturing Practice (GMP)</option>
                </select>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {['regulatoryGuideline', 'protocolGuideline'].map((type) => (
                    <div key={type} className="p-4 bg-gray-50 rounded border">
                      <h3 className="font-bold mb-3 uppercase text-[10px] text-gray-500 tracking-wider">
                        {type.replace('G', ' G')}
                      </h3>
                      <div className="space-y-2">
                        {['documentId', 'sectionId', 'subsectionId', 'contentId'].map((field) => (
                          <input
                            key={field}
                            placeholder={field}
                            className="w-full p-2 text-xs border rounded bg-white"
                            value={manualContext[type][field]}
                            onChange={(e) => handleContextChange(type, field, e.target.value)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleGenerateFinding}
                  disabled={loading || !auditObs}
                  className="w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? 'Processing Findings...' : 'Generate Finding'}
                </button>
                
                {error && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
              </div>

              {/* Right Column: Results Display */}
              <div className="space-y-4">
                {findingOutput ? (
                  <div className="bg-green-50 p-6 border-l-4 border-green-500 rounded shadow-lg sticky top-8">
                    <h3 className="text-lg font-bold mb-4 text-green-800 flex items-center">
                      <span className="mr-2">✨</span> AI Generated Finding
                    </h3>
                    <p className="whitespace-pre-wrap text-gray-800 leading-relaxed text-sm">
                      {findingOutput}
                    </p>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center text-gray-400 sticky top-8">
                    <p>Generated findings will appear here after submission.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}



        {/* Placeholder for other tabs based on your previous code */}
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