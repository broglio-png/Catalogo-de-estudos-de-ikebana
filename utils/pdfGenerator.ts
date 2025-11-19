
import { jsPDF } from "jspdf";
import { CatalogedWork } from "../types";
import { IKEBANA_CURRICULUM, GRADUATIONS } from "../constants";

export const generateIkebanaBooklet = (works: CatalogedWork[]) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Color Constants (using RGB)
  const PRIMARY_COLOR = [94, 45, 145] as [number, number, number]; // #5E2D91
  const TEXT_COLOR = [60, 60, 60] as [number, number, number];
  const SUBTEXT_COLOR = [100, 100, 100] as [number, number, number];

  // Helper: Sanitize Text (Remove Kanji inside parens because standard fonts break)
  // Example: "Expressão (Shasseitai) (斜生体)" -> "Expressão (Shasseitai)"
  const cleanText = (text: string) => {
    // Split by '(' and take the parts that look latin-ish or keep just the first part
    // Simple heuristic: Take the Portuguese part which is usually first.
    const parts = text.split('(');
    if (parts.length > 0) return parts[0].trim();
    return text;
  };

  const authorName = works.length > 0 ? works[0].author : "Estudante de Ikebana";

  // 1. COVER PAGE
  // -----------------------------
  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(0, 0, 210, 297, 'F'); // Full page bg

  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(40);
  
  // Title centered
  doc.text("Meu Livrinho", 105, 100, { align: "center" });
  doc.text("de Ikebana", 105, 120, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.text(`Portfólio de Estudos`, 105, 140, { align: "center" });

  // Divider line
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(1);
  doc.line(70, 150, 140, 150);

  // Author & Date
  doc.setFontSize(14);
  doc.text(`Autor: ${authorName}`, 105, 250, { align: "center" });
  doc.setFontSize(10);
  doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 105, 260, { align: "center" });


  // 2. CONTENT PAGES
  // -----------------------------
  
  // Organize Pages according to curriculum order
  let pageNumber = 1;

  // Filter works: Find the single "best" work for each curriculum item that has entries
  const worksToPrint: { studyId: number; work: CatalogedWork }[] = [];

  IKEBANA_CURRICULUM.forEach(study => {
    // Find all works for this study ID
    const matchingWorks = works.filter(w => w.curriculumId === study.id);
    
    if (matchingWorks.length > 0) {
      // Sort: Favorites first, then Newest date
      matchingWorks.sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
      });
      
      worksToPrint.push({ studyId: study.id, work: matchingWorks[0] });
    }
  });

  if (worksToPrint.length === 0) {
    alert("Adicione estudos ao seu catálogo para gerar o livrinho!");
    return;
  }

  worksToPrint.forEach((item) => {
    const work = item.work;
    const study = IKEBANA_CURRICULUM.find(s => s.id === item.studyId);
    if (!study) return;

    doc.addPage();
    
    // Header: Graduation
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, 210, 30, 'F'); // Header bg
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...PRIMARY_COLOR);
    doc.text(study.graduation.toUpperCase(), 20, 20);

    // Title: Study Name
    doc.setFont("times", "bold");
    doc.setFontSize(24);
    doc.setTextColor(...TEXT_COLOR);
    // Clean text to avoid garbage chars for Japanese
    const studyTitle = cleanText(study.study);
    
    // Handle long titles
    const splitTitle = doc.splitTextToSize(studyTitle, 170);
    doc.text(splitTitle, 20, 50);

    const titleHeight = splitTitle.length * 10; // approx height

    // Image
    // Max area: 170mm width, ~150mm height
    const imgProps = doc.getImageProperties(work.imageDataUrl);
    const availableWidth = 170;
    const availableHeight = 150;
    const imgRatio = imgProps.width / imgProps.height;

    let finalW = availableWidth;
    let finalH = finalW / imgRatio;

    if (finalH > availableHeight) {
      finalH = availableHeight;
      finalW = finalH * imgRatio;
    }

    const xPos = (210 - finalW) / 2; // Center horizontally
    const yPos = 60 + titleHeight;

    doc.addImage(work.imageDataUrl, 'JPEG', xPos, yPos, finalW, finalH);

    // Metadata Section below image
    const metaY = yPos + finalH + 15;

    doc.setDrawColor(200, 200, 200);
    doc.line(20, metaY, 190, metaY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...SUBTEXT_COLOR);
    
    let currentMetaY = metaY + 10;
    
    // Custom Title (if exists and different from study name)
    if (work.customTitle && work.customTitle !== studyTitle) {
        doc.text(`Título: ${work.customTitle}`, 20, currentMetaY);
        currentMetaY += 6;
    }

    doc.text(`Data: ${new Date(work.creationDate).toLocaleDateString()}`, 20, currentMetaY);
    doc.text(`Variedade: ${work.variety}`, 120, currentMetaY);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Ikebana Studio | Página ${pageNumber}`, 105, 285, { align: "center" });

    pageNumber++;
  });

  doc.save("meu-livrinho-ikebana.pdf");
};
