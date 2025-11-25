
import { jsPDF } from "jspdf";
import { CatalogedWork } from "../types";
import { IKEBANA_CURRICULUM } from "../constants";

// Optimized Base64 conversion using FileReader (Async & Non-blocking)
const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            // remove data:application/octet-stream;base64, part
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

// Helper to extract Japanese text from the full title
const parseStudyTitle = (fullTitle: string) => {
    // Regex to match Japanese characters (Hiragana, Katakana, Kanji, Punctuation)
    const jpRegex = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]+/g;
    
    const matches = fullTitle.match(jpRegex);
    const kanji = matches ? matches.join(' ') : '';
    
    // Remove the kanji part from the portuguese title (usually inside parens)
    let portuguese = fullTitle;
    if (kanji) {
        // Remove (Kanji) or just Kanji if not in parens, and cleanup extra spaces
        const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        portuguese = portuguese.replace(new RegExp(`\\(${escapeRegExp(kanji)}\\)`), '').replace(kanji, '').trim();
        // Clean up empty parens () if any were left
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

  // Color Constants (RGB)
  const PRIMARY_COLOR = [94, 45, 145] as [number, number, number]; // #5E2D91
  const ACCENT_COLOR = [176, 117, 209] as [number, number, number]; // #B075D1
  const TEXT_DARK = [60, 60, 60] as [number, number, number];
  const LIGHT_BG = [248, 247, 249] as [number, number, number];

  // Try loading Japanese Font with timeout and optimization
  let fontLoaded = false;
  try {
      const fetchFont = async () => {
          const response = await fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/notosansjp/NotoSansJP-Regular.ttf');
          if (!response.ok) throw new Error("Network response was not ok");
          const blob = await response.blob();
          return await blobToBase64(blob);
      };

      // 4 second timeout to prevent hanging
      const timeout = new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error("Timeout loading font")), 4000)
      );

      const base64Font = await Promise.race([fetchFont(), timeout]);
      
      doc.addFileToVFS('NotoSansJP.ttf', base64Font);
      doc.addFont('NotoSansJP.ttf', 'NotoSansJP', 'normal');
      fontLoaded = true;
  } catch (e) {
      console.warn("Could not load Japanese font (timeout or error), falling back to standard text.", e);
  }

  const authorName = works.length > 0 ? works[0].author : "Estudante de Ikebana";

  // ==========================================
  // 1. COVER PAGE
  // ==========================================
  
  // Background
  doc.setFillColor(...LIGHT_BG);
  doc.rect(0, 0, 210, 297, 'F'); 

  // Decorative Border (Double Line)
  doc.setDrawColor(...PRIMARY_COLOR);
  doc.setLineWidth(1);
  doc.rect(15, 15, 180, 267);
  doc.setLineWidth(0.3);
  doc.rect(18, 18, 174, 261);

  // Logo / Title Section
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

  // Divider
  cursorY += 20;
  doc.setDrawColor(...PRIMARY_COLOR);
  doc.setLineWidth(0.5);
  doc.line(70, cursorY, 140, cursorY);

  // Bottom Info
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

  // ==========================================
  // 2. CONTENT PAGES
  // ==========================================
  let pageNumber = 1;
  const worksToPrint: { studyId: number; work: CatalogedWork }[] = [];

  IKEBANA_CURRICULUM.forEach(study => {
    const matchingWorks = works.filter(w => w.curriculumId === study.id);
    if (matchingWorks.length > 0) {
      // Prioritize Favorites, then Newest
      matchingWorks.sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
      });
      worksToPrint.push({ studyId: study.id, work: matchingWorks[0] });
    }
  });

  if (worksToPrint.length === 0) {
      return; 
  }

  for (const item of worksToPrint) {
    const work = item.work;
    const study = IKEBANA_CURRICULUM.find(s => s.id === item.studyId);
    if (!study) continue;

    doc.addPage();
    
    // Parse Title
    const { portuguese, kanji } = parseStudyTitle(study.study);

    // --- Header Section ---
    doc.setFillColor(...LIGHT_BG);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Graduation Pill
    doc.setFillColor(...PRIMARY_COLOR);
    doc.roundedRect(15, 12, 40, 7, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(study.graduation.toUpperCase(), 35, 16.5, { align: "center" });

    let headerY = 30;

    // Portuguese Title
    doc.setFont("times", "bold"); // Standard PDF font for Portuguese title
    if (fontLoaded) doc.setFont('NotoSansJP', 'normal'); // Use JP font if loaded just in case chars slip in
    doc.setFontSize(18);
    doc.setTextColor(...PRIMARY_COLOR);
    
    // Handle long titles
    if (portuguese.length > 35) doc.setFontSize(14);
    const splitTitle = doc.splitTextToSize(portuguese, 180);
    doc.text(splitTitle, 15, headerY);

    // Kanji Subtitle (if available)
    if (kanji && fontLoaded) {
        const titleHeight = splitTitle.length * (doc.getFontSize() * 0.3527) + 2;
        doc.setFont('NotoSansJP', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(...ACCENT_COLOR);
        doc.text(kanji, 15, headerY + titleHeight);
    } else if (kanji && !fontLoaded) {
        // Fallback if font failed: dont print kanji to avoid squares
    }

    // --- Image Section ---
    const startY = 55; 
    
    try {
        const format = work.imageDataUrl.includes('image/png') ? 'PNG' : 'JPEG';
        const imgProps = doc.getImageProperties(work.imageDataUrl);
        
        // Define Image Area
        const maxW = 160;
        const maxH = 150; 
        const ratio = imgProps.width / imgProps.height;
        
        let w = maxW;
        let h = w / ratio;
        if (h > maxH) {
            h = maxH;
            w = h * ratio;
        }

        const x = (210 - w) / 2;
        const y = startY;

        // Drop Shadow Effect
        doc.setFillColor(220, 220, 220); // Light Gray
        doc.rect(x + 2, y + 2, w, h, 'F');

        // White border / background
        doc.setFillColor(255, 255, 255);
        doc.rect(x, y, w, h, 'F');

        // Image
        doc.addImage(work.imageDataUrl, format, x, y, w, h);
        
        // Thin Border
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.2);
        doc.rect(x, y, w, h);

        // --- Metadata Footer ---
        const metaY = y + h + 15;
        
        // Decorative line
        doc.setDrawColor(...ACCENT_COLOR);
        doc.setLineWidth(0.5);
        doc.line(25, metaY, 185, metaY);

        // Grid Layout for Data
        const col1 = 30;
        const col2 = 120;
        const row1 = metaY + 8;
        const row2 = metaY + 20;

        // Helper for labels
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

        // Optional Custom Title if different
        if (work.customTitle && work.customTitle !== portuguese) {
             printLabel("TÍTULO DO ALUNO", col2, row2);
             printValue(work.customTitle, col2, row2 + 5);
        }

    } catch (err) {
        console.error("Image Error", err);
        doc.setTextColor(255, 0, 0);
        doc.text("Imagem não disponível", 105, startY + 50, { align: 'center' });
    }

    // --- Page Footer ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    
    // Page Number
    doc.text(`${pageNumber}`, 105, 285, { align: "center" });
    
    // Brand
    doc.setTextColor(...ACCENT_COLOR);
    doc.setFontSize(6);
    doc.text("Ikebana Studio", 195, 285, { align: "right" });

    pageNumber++;
  }

  doc.save(`portfolio-ikebana-${new Date().toISOString().slice(0,10)}.pdf`);
};
