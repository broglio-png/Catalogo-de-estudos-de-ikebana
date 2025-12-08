
import { jsPDF } from "jspdf";
import { CatalogedWork } from "../types";
import { IKEBANA_CURRICULUM } from "../constants";

// Optimized Base64 conversion
const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const parseStudyTitle = (fullTitle: string) => {
    const jpRegex = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]+/g;
    const matches = fullTitle.match(jpRegex);
    const kanji = matches ? matches.join(' ') : '';
    let portuguese = fullTitle;
    if (kanji) {
        const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        portuguese = portuguese.replace(new RegExp(`\\(${escapeRegExp(kanji)}\\)`), '').replace(kanji, '').trim();
        portuguese = portuguese.replace(/\(\s*\)/g, '').trim();
    }
    return { portuguese, kanji };
};

export const generateIkebanaBooklet = async (works: CatalogedWork[]) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const PRIMARY_COLOR = [94, 45, 145] as [number, number, number]; 
  const ACCENT_COLOR = [176, 117, 209] as [number, number, number]; 
  const TEXT_DARK = [60, 60, 60] as [number, number, number];
  const LIGHT_BG = [248, 247, 249] as [number, number, number];

  let fontLoaded = false;
  try {
      const fetchFont = async () => {
          const response = await fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/notosansjp/NotoSansJP-Regular.ttf');
          if (!response.ok) throw new Error("Network response was not ok");
          const blob = await response.blob();
          return await blobToBase64(blob);
      };
      const timeout = new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error("Timeout loading font")), 4000)
      );
      const base64Font = await Promise.race([fetchFont(), timeout]);
      doc.addFileToVFS('NotoSansJP.ttf', base64Font);
      doc.addFont('NotoSansJP.ttf', 'NotoSansJP', 'normal');
      fontLoaded = true;
  } catch (e) {
      console.warn("Could not load Japanese font", e);
  }

  const authorName = works.length > 0 ? works[0].author : "Estudante de Ikebana";

  // COVER PAGE
  doc.setFillColor(...LIGHT_BG);
  doc.rect(0, 0, 210, 297, 'F'); 
  doc.setDrawColor(...PRIMARY_COLOR);
  doc.setLineWidth(1);
  doc.rect(15, 15, 180, 267);
  doc.setLineWidth(0.3);
  doc.rect(18, 18, 174, 261);

  const centerX = 105;
  let cursorY = 80;

  doc.setTextColor(...PRIMARY_COLOR);
  doc.setFont("times", "bold");
  doc.setFontSize(50);
  doc.text("Meu Livrinho", centerX, cursorY, { align: "center" });
  
  cursorY += 15;
  doc.setFontSize(32);
  doc.setFont("times", "italic");
  doc.setTextColor(...ACCENT_COLOR);
  doc.text("de Ikebana", centerX, cursorY, { align: "center" });

  cursorY += 20;
  doc.setDrawColor(...PRIMARY_COLOR);
  doc.setLineWidth(0.5);
  doc.line(70, cursorY, 140, cursorY);

  cursorY = 230;
  doc.setFontSize(16);
  doc.setFont("times", "bold");
  doc.setTextColor(...TEXT_DARK);
  if (fontLoaded) doc.setFont('NotoSansJP', 'normal'); 
  doc.text(authorName, centerX, cursorY, { align: "center" });
  
  cursorY += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(new Date().toLocaleDateString(), centerX, cursorY, { align: "center" });

  // CONTENT PAGES
  let pageNumber = 1;
  const worksToPrint: { studyId: number; work: CatalogedWork }[] = [];

  IKEBANA_CURRICULUM.forEach(study => {
    // Filtrar apenas trabalhos marcados como favoritos para este estudo
    const matchingWorks = works.filter(w => w.curriculumId === study.id && w.isFavorite);
    
    if (matchingWorks.length > 0) {
      // Ordenar por data (mais recente primeiro) já que todos são favoritos
      matchingWorks.sort((a, b) => {
        return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
      });
      worksToPrint.push({ studyId: study.id, work: matchingWorks[0] });
    }
  });

  if (worksToPrint.length === 0) {
      alert("Nenhum estudo favorito encontrado. Marque seus melhores estudos com uma estrela para gerar o portfólio.");
      return;
  }

  for (const item of worksToPrint) {
    const work = item.work;
    const study = IKEBANA_CURRICULUM.find(s => s.id === item.studyId);
    if (!study) continue;

    doc.addPage();
    const { portuguese, kanji } = parseStudyTitle(study.study);

    // Header
    doc.setFillColor(...LIGHT_BG);
    doc.rect(0, 0, 210, 45, 'F'); // Increased height for subgroup
    
    // Graduation Pill
    doc.setFillColor(...PRIMARY_COLOR);
    doc.roundedRect(15, 12, 40, 7, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(study.graduation.toUpperCase(), 35, 16.5, { align: "center" });

    // Subgroup Text
    doc.setTextColor(...TEXT_DARK);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(study.subGroup, 60, 16.5);

    let headerY = 32;

    // Title
    doc.setFont("times", "bold");
    if (fontLoaded) doc.setFont('NotoSansJP', 'normal'); 
    doc.setFontSize(18);
    doc.setTextColor(...PRIMARY_COLOR);
    
    if (portuguese.length > 35) doc.setFontSize(14);
    const splitTitle = doc.splitTextToSize(portuguese, 180);
    doc.text(splitTitle, 15, headerY);

    // Kanji
    if (kanji && fontLoaded) {
        const titleHeight = splitTitle.length * (doc.getFontSize() * 0.3527) + 2;
        doc.setFont('NotoSansJP', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(...ACCENT_COLOR);
        doc.text(kanji, 15, headerY + titleHeight);
    }

    // Image
    const startY = 60; 
    try {
        const format = work.imageDataUrl.includes('image/png') ? 'PNG' : 'JPEG';
        const imgProps = doc.getImageProperties(work.imageDataUrl);
        const maxW = 160;
        const maxH = 150; 
        const ratio = imgProps.width / imgProps.height;
        let w = maxW;
        let h = w / ratio;
        if (h > maxH) { h = maxH; w = h * ratio; }

        const x = (210 - w) / 2;
        const y = startY;

        doc.setFillColor(220, 220, 220);
        doc.rect(x + 2, y + 2, w, h, 'F');
        doc.setFillColor(255, 255, 255);
        doc.rect(x, y, w, h, 'F');
        doc.addImage(work.imageDataUrl, format, x, y, w, h);
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.2);
        doc.rect(x, y, w, h);

        // Metadata Footer
        const metaY = y + h + 15;
        doc.setDrawColor(...ACCENT_COLOR);
        doc.setLineWidth(0.5);
        doc.line(25, metaY, 185, metaY);

        const col1 = 30;
        const col2 = 120;
        const row1 = metaY + 8;
        const row2 = metaY + 20;

        const printLabel = (label: string, x: number, y: number) => {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(...ACCENT_COLOR);
            doc.text(label, x, y);
        };

        const printValue = (value: string, x: number, y: number) => {
            if (fontLoaded) doc.setFont('NotoSansJP', 'normal');
            else doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor(...TEXT_DARK);
            doc.text(value, x, y);
        };

        printLabel("AUTOR", col1, row1);
        printValue(work.author, col1, row1 + 5);

        printLabel("DATA", col2, row1);
        printValue(new Date(work.creationDate).toLocaleDateString(), col2, row1 + 5);

        printLabel("VARIEDADE", col1, row2);
        printValue(work.variety, col1, row2 + 5);

        if (work.customTitle && work.customTitle !== portuguese) {
             printLabel("TÍTULO DO ALUNO", col2, row2);
             printValue(work.customTitle, col2, row2 + 5);
        }

    } catch (err) {
        doc.setTextColor(255, 0, 0);
        doc.text("Imagem não disponível", 105, startY + 50, { align: 'center' });
    }

    // Page Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`${pageNumber}`, 105, 285, { align: "center" });
    doc.setTextColor(...ACCENT_COLOR);
    doc.setFontSize(6);
    doc.text("Ikebana Studio", 195, 285, { align: "right" });

    pageNumber++;
  }

  doc.save(`portfolio-ikebana-${new Date().toISOString().slice(0,10)}.pdf`);
};
