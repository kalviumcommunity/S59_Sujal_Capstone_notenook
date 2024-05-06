const PdfViewer = ({ fileReference }) => {
  return (
    <div className="pdfViewer">
      <iframe
        src={fileReference?.url}
        title="PDF Viewer"
        className="iframe"
      />
    </div>
  );
};

export default PdfViewer;
