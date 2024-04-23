import React from 'react';
import { PDFViewer } from 'pdf-viewer-reactjs';

function PDFViewerComponent({ pdfUrl }) {
  return (
    <div>
      <h1>PDF Viewer</h1>
      <PDFViewer
        document={{
          url: pdfUrl,
        }}
      />
    </div>
  );
}

export default PDFViewerComponent;
