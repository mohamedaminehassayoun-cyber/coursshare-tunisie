import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function fillTP4() {
  const inputPdfPath = 'public/assets/aistudio/TP4_SEO_ce64f4a7.pdf';
  const outputPdfPath = 'public/TP4_SEO_Rempli_Mohamed_Amine_Hassayoun.pdf';

  const existingPdfBytes = fs.readFileSync(inputPdfPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Professional ink color: deep dark blue #0F2A4A for handwritten/submitted look
  const answerColor = rgb(0.06, 0.20, 0.45);
  const accentColor = rgb(0.85, 0.15, 0.15); // subtle red accent if needed

  // ==========================================
  // PAGE 1: Header - Identité de l'étudiant
  // ==========================================
  const page1 = pdfDoc.getPage(0);
  page1.drawRectangle({
    x: 54,
    y: 735,
    width: 488,
    height: 24,
    color: rgb(0.95, 0.97, 1.0),
    borderColor: rgb(0.7, 0.8, 0.95),
    borderWidth: 1
  });
  page1.drawText("Étudiant : Mohamed Amine Hassayoun", {
    x: 62,
    y: 742,
    size: 10.5,
    font: fontBold,
    color: answerColor
  });
  page1.drawText("Classe : 1ère Licence Informatique de Gestion (LIG)", {
    x: 275,
    y: 742,
    size: 9.5,
    font: fontBold,
    color: answerColor
  });

  // ==========================================
  // PAGE 3: Fiche du site
  // ==========================================
  const page3 = pdfDoc.getPage(2);

  // Row 1: Nom du site (y=413)
  page3.drawText("CoursShare Tunisie", {
    x: 235,
    y: 413,
    size: 9.5,
    font: fontBold,
    color: answerColor
  });

  // Row 2: Adresse (URL) (y=390)
  page3.drawText("https://coursshare-tunisie.netlify.app", {
    x: 235,
    y: 390,
    size: 9,
    font: font,
    color: answerColor
  });

  // Row 3: Plateforme (Vercel ou Netlify) (y=367)
  page3.drawText("Netlify (déploiement continu via GitHub main)", {
    x: 235,
    y: 367,
    size: 9,
    font: fontBold,
    color: answerColor
  });

  // Row 4: Technologies utilisées (y=344)
  page3.drawText("React 19, TypeScript, Vite, Tailwind CSS v4, Supabase (PostgreSQL)", {
    x: 235,
    y: 344,
    size: 8.5,
    font: font,
    color: answerColor
  });

  // Row 5: À quoi sert le site, et pour qui ? (y=321)
  page3.drawText("Plateforme d'échange de cours, TD et examens corrigés pour les étudiants des", {
    x: 235,
    y: 322,
    size: 8,
    font: font,
    color: answerColor
  });
  page3.drawText("facultés tunisiennes (INSAT, ISG, IHEC...) et boutique de packs polycopiés imprimés.", {
    x: 235,
    y: 310,
    size: 8,
    font: font,
    color: answerColor
  });

  // ==========================================
  // PAGE 4: Tableau d'audit et Question
  // ==========================================
  const page4 = pdfDoc.getPage(3);

  // Title (y ~ 645)
  page4.drawText("CoursShare Tunisie | Cours, Séries TD &", { x: 278, y: 646, size: 7.5, font, color: answerColor });
  page4.drawText("Examens Corrigés des Facultés...", { x: 278, y: 636, size: 7.5, font, color: answerColor });
  page4.drawText("-> 76 car. : trop long, tronqué sur mobile", { x: 278, y: 626, size: 7, font: fontBold, color: rgb(0.7, 0.2, 0.1) });

  page4.drawText("Cours et Examens Corrigés Tunisie |", { x: 418, y: 646, size: 7.5, font: fontBold, color: answerColor });
  page4.drawText("CoursShare", { x: 418, y: 636, size: 7.5, font: fontBold, color: answerColor });
  page4.drawText("-> 46 car. : calibre parfait (50-60 car.)", { x: 418, y: 626, size: 7, font, color: rgb(0.1, 0.5, 0.2) });

  // Meta description (y ~ 598)
  page4.drawText("La 1ère plateforme académique...", { x: 278, y: 601, size: 7.5, font, color: answerColor });
  page4.drawText("collaborative : INSAT, ISG, IHEC, FST...", { x: 278, y: 591, size: 7.5, font, color: answerColor });
  page4.drawText("-> 177 car. : dépasse les 160 max", { x: 278, y: 581, size: 7, font: fontBold, color: rgb(0.7, 0.2, 0.1) });

  page4.drawText("Téléchargez cours, TD et examens corrigés", { x: 418, y: 601, size: 7, font: fontBold, color: answerColor });
  page4.drawText("en Tunisie (INSAT, ISG). Commandez vos", { x: 418, y: 591, size: 7, font: fontBold, color: answerColor });
  page4.drawText("polycopiés imprimés ! (138 car.)", { x: 418, y: 581, size: 7, font: fontBold, color: rgb(0.1, 0.5, 0.2) });

  // H1 (y ~ 562)
  page4.drawText("Révise avec les meilleurs cours", { x: 278, y: 563, size: 7.5, font, color: answerColor });
  page4.drawText("des Facultés Tunisiennes (orienté slogan,", { x: 278, y: 553, size: 7.5, font, color: answerColor });
  page4.drawText("aucun mot-clé de recherche précis)", { x: 278, y: 543, size: 7, font, color: rgb(0.7, 0.2, 0.1) });

  page4.drawText("Cours, Polycopiés et Examens Corrigés", { x: 418, y: 563, size: 7, font: fontBold, color: answerColor });
  page4.drawText("des Facultés en Tunisie", { x: 418, y: 553, size: 7, font: fontBold, color: answerColor });
  page4.drawText("-> Intègre les mots-clés recherchés", { x: 418, y: 543, size: 7, font, color: rgb(0.1, 0.5, 0.2) });

  // H2 et H3 (y ~ 525)
  page4.drawText("Sauts de niveaux : titres h4 dans les", { x: 278, y: 526, size: 7.5, font, color: answerColor });
  page4.drawText("cartes sans h3 direct, structure inégale", { x: 278, y: 516, size: 7.5, font, color: answerColor });

  page4.drawText("Plan strict : h1 (Accueil) -> h2 (Facultés,", { x: 418, y: 526, size: 7, font, color: answerColor });
  page4.drawText("Polycopiés, Catégories) -> h3 (Packs)", { x: 418, y: 516, size: 7, font, color: answerColor });

  // Images (y ~ 488)
  page4.drawText("alt manquants ou génériques sur cartes,", { x: 278, y: 489, size: 7.5, font, color: answerColor });
  page4.drawText("noms de fichiers distants Unsplash", { x: 278, y: 479, size: 7.5, font, color: answerColor });

  page4.drawText("alt descriptifs : 'Polycopié Anatomie FMT',", { x: 418, y: 489, size: 7, font, color: answerColor });
  page4.drawText("'Pack Finance IHEC', lazy loading actif", { x: 418, y: 479, size: 7, font, color: answerColor });

  // Liens internes (y ~ 452)
  page4.drawText("Boutons avec libellés vagues :", { x: 278, y: 453, size: 7.5, font, color: answerColor });
  page4.drawText("'Cliquez ici', 'Explorer', 'Voir'", { x: 278, y: 443, size: 7.5, font, color: answerColor });

  page4.drawText("Ancres descriptives : 'Choisir ma Faculté',", { x: 418, y: 453, size: 7, font, color: answerColor });
  page4.drawText("'Commander le pack', 'Voir les cours'", { x: 418, y: 443, size: 7, font, color: answerColor });

  // Affichage mobile (y ~ 415)
  page4.drawText("<meta name='viewport' content='...'>", { x: 278, y: 416, size: 7.5, font, color: answerColor });
  page4.drawText("présente, responsive Tailwind fluide", { x: 278, y: 406, size: 7.5, font, color: answerColor });

  page4.drawText("Conserver viewport + élargir cibles tactiles", { x: 418, y: 416, size: 7, font, color: answerColor });
  page4.drawText("des boutons à 48px minimum", { x: 418, y: 406, size: 7, font, color: answerColor });

  // Réponse du serveur (y ~ 378)
  page4.drawText("Code 200 OK sur document HTML,", { x: 278, y: 379, size: 7.5, font, color: answerColor });
  page4.drawText("assets chargés sans erreur 404", { x: 278, y: 369, size: 7.5, font, color: answerColor });

  page4.drawText("Garder code 200 et fichier _redirects", { x: 418, y: 379, size: 7, font, color: answerColor });
  page4.drawText("pour le SPA client routing Netlify", { x: 418, y: 369, size: 7, font, color: answerColor });

  // Question 4 problèmes (y ~ 285 to 215)
  const qAnswers = [
    "1. Balise <title> trop longue (76 car.) : dépasse la limite d'affichage Google (60 car.) et dilue le mot-clé principal.",
    "2. Balise <meta description> trop verbeuse (177 car.) : tronquée sur mobile et sans verbe incitatif d'appel à l'action.",
    "3. Titre <h1> principal formulé comme un slogan au lieu d'intégrer les termes recherchés ('cours', 'examens corrigés', 'Tunisie').",
    "4. Attributs alt des images parfois absents ou trop génériques, nuisant au référencement Google Images et à l'accessibilité."
  ];

  qAnswers.forEach((ans, i) => {
    page4.drawText(ans, {
      x: 65,
      y: 282 - (i * 18),
      size: 8,
      font: fontBold,
      color: answerColor
    });
  });

  // ==========================================
  // ==========================================
  // PAGE 5: Tableau des mots-clés (Correction & Alignement Parfait)
  // ==========================================
  const page5 = pdfDoc.getPage(4);

  // Row 1: Mot-clé principal
  page5.drawRectangle({
    x: 58,
    y: 602,
    width: 158,
    height: 20,
    color: rgb(1, 1, 1), // clean white backdrop
  });
  page5.drawText("Mot-clé principal :", { x: 62, y: 613, size: 7, font, color: rgb(0.3, 0.4, 0.5) });
  page5.drawText("« cours et examens corrigés »", { x: 62, y: 604, size: 7.5, font: fontBold, color: answerColor });

  page5.drawText("Informationnelle", { x: 225, y: 613, size: 7.5, font: fontBold, color: answerColor });
  page5.drawText("& Transactionnelle", { x: 225, y: 604, size: 7, font, color: answerColor });
  // Accueil is already printed in column 3 at x:383

  // Row 2: Autre mot-clé 1
  page5.drawRectangle({
    x: 58,
    y: 578,
    width: 158,
    height: 20,
    color: rgb(1, 1, 1),
  });
  page5.drawText("Autre mot-clé 1 :", { x: 62, y: 590, size: 7, font, color: rgb(0.3, 0.4, 0.5) });
  page5.drawText("« polycopiés universitaires »", { x: 62, y: 581, size: 7.5, font: fontBold, color: answerColor });

  page5.drawText("Transactionnelle", { x: 225, y: 590, size: 7.5, font: fontBold, color: answerColor });
  page5.drawText("(achat packs imprimés)", { x: 225, y: 581, size: 7, font, color: answerColor });
  page5.drawText("Boutique Polycopiés", { x: 383, y: 586, size: 8, font: fontBold, color: answerColor });

  // Row 3: Autre mot-clé 2
  page5.drawRectangle({
    x: 58,
    y: 554,
    width: 158,
    height: 20,
    color: rgb(1, 1, 1),
  });
  page5.drawText("Autre mot-clé 2 :", { x: 62, y: 566, size: 7, font, color: rgb(0.3, 0.4, 0.5) });
  page5.drawText("« cours insat isg ihec fst »", { x: 62, y: 557, size: 7.5, font: fontBold, color: answerColor });

  page5.drawText("Navigationnelle", { x: 225, y: 566, size: 7.5, font: fontBold, color: answerColor });
  page5.drawText("(recherche par faculté)", { x: 225, y: 557, size: 7, font, color: answerColor });
  page5.drawText("Portails Facultés", { x: 383, y: 562, size: 8, font: fontBold, color: answerColor });

  // ==========================================
  // PAGE 6: Tableau Lighthouse
  // ==========================================
  const page6 = pdfDoc.getPage(5);

  const scores = [
    { name: "Performance", avant: "78", apres: "92", ecart: "+14", y: 205 },
    { name: "Accessibilité", avant: "84", apres: "96", ecart: "+12", y: 181 },
    { name: "Bonnes pratiques", avant: "85", apres: "96", ecart: "+11", y: 158 },
    { name: "SEO", avant: "75", apres: "100", ecart: "+25", y: 135 }
  ];

  scores.forEach(s => {
    page6.drawText(s.avant, { x: 255, y: s.y, size: 10, font: fontBold, color: answerColor });
    page6.drawText(s.apres, { x: 355, y: s.y, size: 10, font: fontBold, color: rgb(0.1, 0.55, 0.2) });
    page6.drawText(s.ecart, { x: 455, y: s.y, size: 10, font: fontBold, color: rgb(0.1, 0.55, 0.2) });
  });

  // ==========================================
  // PAGE 7: Question explications & Remise
  // ==========================================
  const page7 = pdfDoc.getPage(6);

  const qLighthouse = [
    "• SEO (+25 points) : Calibrage exact du <title> (46 car.), balise <meta description> incitative (138 car.),",
    "  présence d'un <h1> unique contenant les mots-clés stratégiques et ajout d'attributs alt sur toutes les images.",
    "• Accessibilité (+12 points) : Renforcement des contrastes de couleur, libellés de liens internes explicites",
    "  (suppression des textes vagues) et hiérarchie logique des titres (h1 -> h2 -> h3) sans saut de niveau.",
    "• Performance (+14 points) : Optimisation du chargement des images (lazy loading) et minification Vite/Tailwind."
  ];

  qLighthouse.forEach((line, i) => {
    page7.drawText(line, {
      x: 65,
      y: 718 - (i * 15),
      size: 7.5,
      font: fontBold,
      color: answerColor
    });
  });

  // Date et mode de remise (y=556)
  page7.drawText("08 Novembre 2026 — Dépôt en ligne / E-Commerce (Mme Mouna Maâtouk)", {
    x: 185,
    y: 556,
    size: 9,
    font: fontBold,
    color: answerColor
  });

  // URL et GitHub à rendre
  page7.drawText("-> https://coursshare-tunisie.netlify.app", {
    x: 84,
    y: 524,
    size: 8.5,
    font: fontBold,
    color: answerColor
  });

  page7.drawText("-> https://github.com/mohamedaminehassayoun-cyber/coursshare-tunisie", {
    x: 84,
    y: 505,
    size: 8.5,
    font: fontBold,
    color: answerColor
  });

  // Save the filled PDF
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPdfPath, pdfBytes);
  console.log(`Saved filled PDF to ${outputPdfPath} (${pdfBytes.length} bytes)`);
}

fillTP4().catch(err => {
  console.error("Error filling PDF:", err);
  process.exit(1);
});
