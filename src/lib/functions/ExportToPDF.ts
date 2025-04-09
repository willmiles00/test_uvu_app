import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportPageToPDF(filename = 'webpage.pdf') {
  try {
    const canvas = await html2canvas(document.body, { // Or document.documentElement
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  } catch (error) {
    console.error('Error exporting webpage to PDF:', error);
  }
}

// create a print.css file in the public folder and add the following styles to it
// /* print.css */
// @media print {
//     body {
//       font-size: 10pt;
//       color: black;
//       background-color: white;
//     }
  
//     .no-print {
//       display: none; /* Hide elements that shouldn't be in the PDF */
//     }
  
//     /* Add other print-specific styles here */
//   }
  