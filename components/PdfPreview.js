// This component will handle the PDF preview (implementation depends on how you want to display the PDF).
// You might use an iframe, a PDF library, or a third-party component.
export default function PdfPreview({ pdf }) {
  return (
    <div className="border rounded-lg shadow-md p-4"> {/* Added styling */}
      {pdf ? (
        <iframe src={pdf} width="100%" height="600px" title="PDF Preview"></iframe>
      ) : (
        <p>No PDF selected.</p> // Display a message if no PDF is selected
      )}
    </div>
  );
}