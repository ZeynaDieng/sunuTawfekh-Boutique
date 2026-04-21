export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[];
  category: string;
  subcategory?: string;
  description: string;
  inStock: boolean;
  isNew?: boolean;
  isPromo?: boolean;
  rating: number;
  reviews: number;
  filters: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  count: number;
  /** Sous-titre affiché sous le nom (ex. « SOIN & RITUELS ») — optionnel côté API. */
  tagline?: string;
}

export const categories: Category[] = [
  { id: "beaute", name: "Beauté", tagline: "SOIN & RITUELS", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop", count: 45 },
  { id: "parfums", name: "Parfums", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=500&fit=crop", count: 32 },
  { id: "mode", name: "Mode", tagline: "PRÊT-À-PORTER", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop", count: 58 },
  { id: "accessoires", name: "Accessoires", tagline: "MAROQUINERIE", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop", count: 40 },
  { id: "bien-etre", name: "Bien-être", tagline: "SÉRÉNITÉ", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=500&fit=crop", count: 25 },
  { id: "alimentaire", name: "Alimentaire", tagline: "ÉPICERIE FINE", image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&h=500&fit=crop", count: 30 },
];

export const products: Product[] = [
  // Beauté
  { id: "b1", name: "Sérum Éclat Vitamine C", price: 15000, oldPrice: 18000, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop", category: "beaute", description: "Sérum concentré en vitamine C pour un teint lumineux et unifié. Formule naturelle enrichie en acide hyaluronique.", inStock: true, isNew: true, rating: 4.8, reviews: 124, filters: { type: "sérum", marque: "NaturGlow", peau: "mixte", utilisation: "visage", ingredients: "naturel" } },
  { id: "b2", name: "Masque Hydratant Argan", price: 8500, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop", category: "beaute", description: "Masque nourrissant à l'huile d'argan du Maroc. Hydratation intense pour peaux sèches.", inStock: true, rating: 4.6, reviews: 89, filters: { type: "masque", marque: "ArganSecret", peau: "sèche", utilisation: "visage", ingredients: "argan" } },
  { id: "b3", name: "Savon Noir Beldi", price: 3500, image: "https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=400&h=400&fit=crop", category: "beaute", description: "Savon noir traditionnel marocain pour gommage corporel en profondeur.", inStock: true, rating: 4.9, reviews: 210, filters: { type: "savon", marque: "Hammam", peau: "grasse", utilisation: "corps", ingredients: "naturel" } },
  { id: "b4", name: "Crème Anti-âge Premium", price: 22000, oldPrice: 25000, image: "https://images.unsplash.com/photo-1570194065650-d99fb4a38c8f?w=400&h=400&fit=crop", category: "beaute", description: "Crème anti-rides haute performance aux peptides et rétinol.", inStock: false, isPromo: true, rating: 4.7, reviews: 67, filters: { type: "crème", marque: "LuxSkin", peau: "sèche", utilisation: "visage", ingredients: "bio" } },
  // Parfums
  { id: "p1", name: "Oud Royal de Dubaï", price: 35000, image: "https://images.unsplash.com/photo-1594035910387-fbd1a485b12e?w=400&h=400&fit=crop", category: "parfums", description: "Parfum d'exception à base de oud rare de Dubaï. Notes boisées et ambrées intenses.", inStock: true, isNew: true, rating: 4.9, reviews: 156, filters: { genre: "unisexe", type: "parfum", contenance: "100ml", intensite: "fort", origine: "Dubaï" } },
  { id: "p2", name: "Fleur de Jasmin", price: 18000, image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&h=400&fit=crop", category: "parfums", description: "Eau de parfum florale délicate au jasmin et rose de Damas.", inStock: true, rating: 4.5, reviews: 98, filters: { genre: "femme", type: "eau de toilette", contenance: "50ml", intensite: "léger", origine: "Maroc" } },
  { id: "p3", name: "Musc Blanc Intense", price: 12000, image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&h=400&fit=crop", category: "parfums", description: "Brume corporelle au musc blanc. Fraîcheur longue durée.", inStock: true, isPromo: true, oldPrice: 15000, rating: 4.3, reviews: 45, filters: { genre: "femme", type: "brume", contenance: "200ml", intensite: "léger", origine: "Dubaï" } },
  // Mode
  { id: "m1", name: "Robe Satin Élégance", price: 28000, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop", category: "mode", description: "Robe en satin fluide, coupe droite avec fente latérale. Parfaite pour les occasions.", inStock: true, isNew: true, rating: 4.7, reviews: 34, filters: { type: "robe", taille: "M", couleur: "noir", genre: "femme" } },
  { id: "m2", name: "Ensemble Lin Premium", price: 32000, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop", category: "mode", description: "Ensemble en lin naturel, coupe relaxée et élégante.", inStock: true, rating: 4.6, reviews: 21, filters: { type: "ensemble", taille: "L", couleur: "beige", genre: "femme" } },
  { id: "m3", name: "Bonnet Cachemire", price: 9500, image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400&h=400&fit=crop", category: "mode", description: "Bonnet en pur cachemire, douceur et chaleur incomparables.", inStock: true, rating: 4.4, reviews: 56, filters: { type: "bonnet", taille: "unique", couleur: "gris", genre: "unisexe" } },
  // Accessoires
  { id: "a1", name: "Sac Cuir Artisanal", price: 45000, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop", category: "accessoires", description: "Sac à main en cuir véritable, fabrication artisanale. Design minimaliste et élégant.", inStock: true, isNew: true, rating: 4.8, reviews: 78, filters: { type: "sac", couleur: "marron", matiere: "cuir", genre: "femme" } },
  { id: "a2", name: "Sandales Dorées", price: 16000, image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop", category: "accessoires", description: "Sandales à lanières dorées, confort et style pour l'été.", inStock: true, rating: 4.5, reviews: 43, filters: { type: "sandale", couleur: "doré", matiere: "cuir synthétique", genre: "femme" } },
  // Alimentaire
  { id: "al1", name: "Huile d'Argan Bio", price: 12000, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop", category: "alimentaire", description: "Huile d'argan alimentaire bio pressée à froid. Riche en oméga et vitamine E.", inStock: true, rating: 4.9, reviews: 167, filters: { type: "huile", origine: "Maroc", bio: "oui" } },
  { id: "al2", name: "Épices Premium Ras el Hanout", price: 5500, image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop", category: "alimentaire", description: "Mélange d'épices traditionnel, sélection premium de 27 épices.", inStock: true, isNew: true, rating: 4.7, reviews: 89, filters: { type: "épices", origine: "Maroc", bio: "non" } },
  // Bien-être
  { id: "be1", name: "Complément Cheveux & Ongles", price: 14000, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop", category: "bien-etre", description: "Complexe de biotine, zinc et kératine pour des cheveux forts et des ongles résistants.", inStock: true, rating: 4.6, reviews: 112, filters: { type: "complément", objectif: "cheveux", composition: "naturel" } },
  { id: "be2", name: "Huile de Nigelle Pure", price: 7500, oldPrice: 9000, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop", category: "bien-etre", description: "Huile de nigelle 100% pure pressée à froid. Propriétés anti-inflammatoires.", inStock: true, isPromo: true, rating: 4.8, reviews: 203, filters: { type: "huiles", objectif: "peau", composition: "naturel" } },
];

export const filterConfig: Record<string, { label: string; key: string; options: string[] }[]> = {
  beaute: [
    { label: "Type", key: "type", options: ["crème", "masque", "sérum", "savon", "huile"] },
    { label: "Marque", key: "marque", options: ["NaturGlow", "ArganSecret", "Hammam", "LuxSkin", "Balea", "Mixa"] },
    { label: "Type de peau", key: "peau", options: ["sèche", "grasse", "mixte"] },
    { label: "Utilisation", key: "utilisation", options: ["visage", "corps", "cheveux"] },
    { label: "Ingrédients", key: "ingredients", options: ["naturel", "bio", "argan"] },
  ],
  parfums: [
    { label: "Genre", key: "genre", options: ["homme", "femme", "unisexe"] },
    { label: "Type", key: "type", options: ["parfum", "eau de toilette", "brume"] },
    { label: "Contenance", key: "contenance", options: ["50ml", "100ml", "200ml"] },
    { label: "Intensité", key: "intensite", options: ["léger", "fort"] },
    { label: "Origine", key: "origine", options: ["Dubaï", "Maroc"] },
  ],
  mode: [
    { label: "Type", key: "type", options: ["robe", "ensemble", "bonnet"] },
    { label: "Taille", key: "taille", options: ["S", "M", "L", "XL", "unique"] },
    { label: "Couleur", key: "couleur", options: ["noir", "beige", "gris", "blanc"] },
    { label: "Genre", key: "genre", options: ["femme", "homme", "unisexe"] },
  ],
  accessoires: [
    { label: "Type", key: "type", options: ["sac", "sandale", "chaussure"] },
    { label: "Couleur", key: "couleur", options: ["marron", "doré", "noir"] },
    { label: "Matière", key: "matiere", options: ["cuir", "cuir synthétique", "tissu"] },
    { label: "Genre", key: "genre", options: ["femme", "homme", "unisexe"] },
  ],
  alimentaire: [
    { label: "Type", key: "type", options: ["huile", "épices", "farine", "graines"] },
    { label: "Origine", key: "origine", options: ["Maroc", "Sénégal", "France"] },
    { label: "Bio", key: "bio", options: ["oui", "non"] },
  ],
  "bien-etre": [
    { label: "Type", key: "type", options: ["complément", "huiles", "produits naturels"] },
    { label: "Objectif", key: "objectif", options: ["minceur", "cheveux", "peau"] },
    { label: "Composition", key: "composition", options: ["naturel", "bio"] },
  ],
  /** Catalogue Orion (slug boutique) — options enrichies par les valeurs réelles des produits. */
  boutique: [
    { label: "Type", key: "type", options: ["simple", "variable"] },
    { label: "Origine", key: "origin", options: ["orion"] },
  ],
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fr-SN", { style: "decimal" }).format(price) + " FCFA";
};
