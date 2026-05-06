import React, { useState, useRef, useEffect } from "react";
import { saveOrderToSupabase } from "./lib/supabase";
import { Coffee, Cake, Croissant, Calendar, Clock, MapPin, Plus, Minus, User, Phone, Check, Instagram, ArrowRight, Trash2, X, Truck, Store } from "lucide-react";

interface Pack {
  id: string;
  name: string;
  price: string;
  pax: string;
  description: string;
  img: string;
}

const WhatsappIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const TiktokIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

// --- DATA ---
const WHATSAPP_NUMBER = "5491126530944";

const TORTAS_DESAYUNO = [
  "Chocotorta",
  "Brownie c/ nueces, ddl y crema",
  "Cheesecake de frutos rojos",
  "Torta Oreo",
  "Choco-Oreo",
  "Red Velvet",
  "Tiramisú",
  "Tarta de Coco y dulce de leche",
  "Tarta de frutilla",
  "Tarta de dulce de leche, banana y chantilly",
  "Pastafrola de membrillo",
];

const DESAYUNO_TORTA_COUNT: Record<string, number> = {
  salamix: 1,
  detodito: 2,
  willywonka: 4,
};

const PACKS = {
  desayunos: [
    {
      id: "salamix",
      name: "Salamix",
      price: "$50.000",
      pax: "1 persona",
      description: "Caja con visor + stickers y tags. Infusiones surtidas, jugo de naranja, una torta a elección, 2 fosforitos, 2 medialunas, 2 sacramentos, scons de queso, palmeritas.",
      img: "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "detodito",
      name: "De todito",
      price: "$52.000",
      pax: "1 persona",
      description: "Infusiones, jugo, 2 tortas, 2 brownies con nuez, 2 palmeritas XL, sconcitos de queso, pan para tostar, 2 medialunas, 2 fosforitos. Caja con visor + tarjeta.",
      img: "https://images.unsplash.com/photo-1555507036-ab1d4075c6f1?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "willywonka",
      name: "Willy Wonka",
      price: "$68.000",
      pax: "1 persona (Premium)",
      description: "Infusiones, jugo, 4 tortas a elección, 2 brownies, 2 palmeritas XL, sconcitos de queso, 2 medialunas, 2 fosforitos. Cajas con visor + tarjeta.",
      img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800",
    },
  ],
  eventos: [
    {
      id: "festejito",
      name: "Festejito",
      price: "$110.000",
      pax: "10-12 personas",
      description: "12 fosforitos jamón/queso, 12 scons crudo/rúcula/queso, 12 scons dip queso azul/jamón, 24 pan brioche rellenos surtidos, 12 pizzetas con queso.",
      img: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "planazo",
      name: "Planazo",
      price: "$290.000",
      pax: "20-25 personas",
      description: "24 fosforitos, 12 scons crudo, 12 scons queso azul, 36 pan brioche surtidos, 24 pizzetas, 12 figazas roast beef, 12 figazas bondiola, 30 rollitos de miga.",
      img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "full",
      name: "Full Tardes de Té",
      price: "$350.000",
      pax: "30-35 personas",
      description: "24 fosforitos, 12 scons crudo, 12 scons azul, 48 pan brioche, 36 pizzetas, 12 figazas roast beef, 12 bondiola, 12 pollo al verdeo, 30 rollitos miga.",
      img: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=800",
    },
  ],
  pasteleria: [
    {
      id: "pf-red-velvet",
      name: "Petit Fours: Red Velvet",
      price: "Consultar",
      pax: "Por Docena",
      description: "Pequeñas piezas (4-6 cm). En 1 docena podés elegir hasta 3 sabores en total.",
      img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "pf-coco-ddl",
      name: "Petit Fours: Coco y DDL",
      price: "Consultar",
      pax: "Por Docena",
      description: "Tartitas de coco y dulce de leche (4-6 cm). En 1 docena podés elegir hasta 3 sabores en total.",
      img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "pf-batata",
      name: "Petit Fours: Mini Frola Batata",
      price: "Consultar",
      pax: "Por Docena",
      description: "Mini frolas de batata (4-6 cm). En 1 docena podés elegir hasta 3 sabores en total.",
      img: "https://images.unsplash.com/photo-1601000938259-9e92002320b2?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "pf-membrillo",
      name: "Petit Fours: Mini Frola Membrillo",
      price: "Consultar",
      pax: "Por Docena",
      description: "Mini frolas de membrillo (4-6 cm). En 1 docena podés elegir hasta 3 sabores en total.",
      img: "https://images.unsplash.com/photo-1601000938259-9e92002320b2?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "pf-lemon",
      name: "Petit Fours: Lemon Pie",
      price: "Consultar",
      pax: "Por Docena",
      description: "Pequeñas piezas (4-6 cm) de Lemon pie. En 1 docena podés elegir hasta 3 sabores en total.",
      img: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "pf-brownie",
      name: "Petit Fours: Brownie",
      price: "Consultar",
      pax: "Por Docena",
      description: "Brownie con dulce de leche y crema/merengue (4-6 cm). En 1 docena podés elegir hasta 3 sabores.",
      img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "pf-tiramisu",
      name: "Petit Fours: Tiramisú",
      price: "Consultar",
      pax: "Por Docena",
      description: "Pequeñas piezas (4-6 cm) de Tiramisú. En 1 docena podés elegir hasta 3 sabores en total.",
      img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "pf-frutales",
      name: "Petit Fours: Frutales",
      price: "Consultar",
      pax: "Por Docena",
      description: "Tartitas frutales con dulce de leche/pastelera y chantilly (4-6 cm). Hasta 3 sabores por docena.",
      img: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "pf-banana",
      name: "Petit Fours: Banana",
      price: "Consultar",
      pax: "Por Docena",
      description: "Tartitas de banana con dulce de leche y chantilly / solo ddl (4-6 cm). Hasta 3 sabores por docena.",
      img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "pf-chocotorta",
      name: "Petit Fours: Chocotorta",
      price: "Consultar",
      pax: "Por Docena",
      description: "Pequeñas piezas (4-6 cm) de Chocotorta. En 1 docena podés elegir hasta 3 sabores en total.",
      img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "pf-cheesecake",
      name: "Petit Fours: Cheesecake",
      price: "Consultar",
      pax: "Por Docena",
      description: "Cheesecake de frutos rojos (4-6 cm). En 1 docena podés elegir hasta 3 sabores en total.",
      img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "pf-oreo",
      name: "Petit Fours: Oreo",
      price: "Consultar",
      pax: "Por Docena",
      description: "Pequeñas piezas (4-6 cm) de Oreo. En 1 docena podés elegir hasta 3 sabores en total.",
      img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "pf-keylime",
      name: "Petit Fours: Key Lime Pie",
      price: "Consultar",
      pax: "Por Docena",
      description: "Pequeñas piezas (4-6 cm) de Key lime pie. En 1 docena podés elegir hasta 3 sabores en total.",
      img: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-oreo-25",
      name: "Torta Oreo (25 cm)",
      price: "$65.000",
      pax: "25 cm",
      description: "Torta entera con chocolatines.",
      img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-oreo-18",
      name: "Torta Oreo (18 cm)",
      price: "$50.000",
      pax: "18 cm",
      description: "Torta entera con chocolatines.",
      img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-cheese-25",
      name: "Cheesecake (25 cm)",
      price: "$60.000",
      pax: "25 cm",
      description: "Torta entera con frutos arriba.",
      img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-cheese-18",
      name: "Cheesecake (18 cm)",
      price: "$45.000",
      pax: "18 cm",
      description: "Torta entera de Cheesecake.",
      img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-brownie-25",
      name: "Torta Brownie (25 cm)",
      price: "$55.000",
      pax: "25 cm",
      description: "Con crema y frutillas.",
      img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-brownie-18",
      name: "Torta Brownie (18 cm)",
      price: "$45.000",
      pax: "18 cm",
      description: "Torta entera de Brownie.",
      img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-choco-26",
      name: "Chocotorta (26 cm)",
      price: "$65.000",
      pax: "26 cm",
      description: "Torta entera con chocolatines.",
      img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-choco-18",
      name: "Chocotorta (18 cm)",
      price: "$50.000",
      pax: "18 cm",
      description: "Torta entera con chocolatines.",
      img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-red-25",
      name: "Red Velvet (25 cm)",
      price: "$55.000",
      pax: "25 cm",
      description: "Torta entera Red velvet.",
      img: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-red-18",
      name: "Red Velvet (18 cm)",
      price: "$40.000",
      pax: "18 cm",
      description: "Torta entera Red velvet.",
      img: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-tiramisu-25",
      name: "Tiramisú (25 cm)",
      price: "$45.000",
      pax: "25 cm",
      description: "Torta entera Tiramisú.",
      img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-tiramisu-22",
      name: "Tiramisú Cuadrado (22 cm)",
      price: "$42.000",
      pax: "22 cm",
      description: "Torta entera Tiramisú cuadrado.",
      img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-tiramisu-18",
      name: "Tiramisú (18 cm)",
      price: "$35.000",
      pax: "18 cm",
      description: "Torta entera Tiramisú.",
      img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-coco-18",
      name: "Tarta de Coco (18 cm)",
      price: "$22.000",
      pax: "18 cm",
      description: "Tarta de coco entera.",
      img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-banana-18",
      name: "Tarta de Banana (18 cm)",
      price: "$26.000",
      pax: "18 cm",
      description: "Con dulce de leche y crema.",
      img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-banana-25",
      name: "Tarta de Banana (25 cm)",
      price: "$38.000",
      pax: "25 cm",
      description: "Con dulce de leche y crema.",
      img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-lemon-18",
      name: "Lemon Pie (18 cm)",
      price: "$35.000",
      pax: "18 cm",
      description: "Tarta Lemon Pie entera.",
      img: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-lemon-25",
      name: "Lemon Pie (25 cm)",
      price: "$40.000",
      pax: "25 cm",
      description: "Tarta Lemon Pie entera.",
      img: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-keylime-18",
      name: "Key Lime Pie (18 cm)",
      price: "$35.000",
      pax: "18 cm",
      description: "Tarta Key Lime Pie entera.",
      img: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-keylime-25",
      name: "Key Lime Pie (25 cm)",
      price: "$40.000",
      pax: "25 cm",
      description: "Tarta Key Lime Pie entera.",
      img: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-frutillas-var",
      name: "Tarta de Frutillas",
      price: "Consultar",
      pax: "18 cm y 25 cm",
      description: "Con pastelera y chantilly / ddl y chantilly.",
      img: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-number-cake",
      name: "Number Cake / Letter Brownie",
      price: "Consultar",
      pax: "Personalizado",
      description: "Con crema.",
      img: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "torta-doble-number",
      name: "Doble Number o Letter Brownie",
      price: "Consultar",
      pax: "Personalizado",
      description: "Con crema.",
      img: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=800",
    }
  ],
  saladitos: [
    {
      id: "brioche-jamon-queso",
      name: "Pan Brioche",
      price: "$18.000",
      pax: "1 Docena",
      description: "Rellenos de jamón cocido y queso tybo. Masa suave y mantecosa.",
      img: "https://images.unsplash.com/photo-1528669697102-a6fbd2789146?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "fosforitos",
      name: "Fosforitos",
      price: "$18.000",
      pax: "1 Docena",
      description: "Clásicos fosforitos de hojaldre glaseado, rellenos de jamón y queso.",
      img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800",
    },
  ]
};

const IMAGE_MAP: Record<string, string> = {
  salamix: "/salamix.jpeg",
  detodito: "/de-todito.jpeg",
  willywonka: "/willy-wonka.jpeg",
  festejito: "/festejito.jpeg",
  planazo: "/planazo.jpeg",
  full: "/full.jpeg",
  "brioche-jamon-queso": "/saladitos.jpeg",
  fosforitos: "/fosforitos.jpeg",
};

Object.values(PACKS).flat().forEach((pack) => {
  if (IMAGE_MAP[pack.id]) {
    pack.img = IMAGE_MAP[pack.id];
  } else if (pack.id.startsWith("pf-")) {
    pack.img = "/petit-four.jpeg";
  } else if (pack.id.startsWith("torta-")) {
    pack.img = "/tortas.jpeg";
  }
});

// --- COMPONENTS ---

const EXTRAS_AVAILABLE = [
  { id: 'ex-taza', name: 'Taza / Tazón de cerámica con logo', price: '$28.000' },
  { id: 'ex-ramo', name: 'Ramo de Flores', price: '$8.000' },
];

export default function App() {
  const [activeView, setActiveView] = useState<'home' | 'catalog' | 'extras' | 'checkout' | 'add_more' | 'edit_cart'>('home');
  const [activePilar, setActivePilar] = useState<'desayunos' | 'eventos' | 'pasteleria' | 'saladitos' | null>(null);
  
  const [cart, setCart] = useState<{id: string, quantity: number}[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<{id: string, quantity: number}[]>([]);
  const [packs, setPacks] = useState<Record<string, Pack[]>>(PACKS);
  const [selectedCakes, setSelectedCakes] = useState<Record<string, string[]>>({});

  // Load products from JSON
  useEffect(() => {
    fetch('/products.json')
      .then(response => response.json())
      .then(data => setPacks(data as Record<string, Pack[]>))
      .catch(error => console.error('Error loading products:', error));
  }, []);

  const handlePilarSelect = (pilar: 'desayunos' | 'eventos' | 'pasteleria' | 'saladitos') => {
    setActivePilar(pilar);
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearPilar = () => {
    setActivePilar(null);
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateCart = (packId: string, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === packId);
      if (existing) {
        if (quantity <= 0) return prev.filter(item => item.id !== packId);
        return prev.map(item => item.id === packId ? { ...item, quantity } : item);
      } else {
         if (quantity > 0) return [...prev, { id: packId, quantity }];
         return prev;
      }
    });
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen font-sans selection:bg-brand-pink/30 relative">
      
      {/* HEADER */}
      <header className="bg-brand-cream py-2 border-b-2 border-brand-orange/10">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center cursor-pointer" onClick={clearPilar}>
          <img src="/logo.png" alt="Tardes de Té" className="w-[90px] h-auto md:w-[106px]" />
        </div>
      </header>

      {activeView === 'catalog' && activePilar && (
        <div className="bg-brand-cream min-h-screen pb-24 border-t-8 border-brand-pink">
          <button 
             onClick={clearPilar} 
             className="px-6 py-6 text-brand-orange font-bold uppercase tracking-wider text-sm hover:text-brand-pink transition-colors flex items-center gap-2"
          >
             ← Volver al inicio
          </button>
          <CatalogSection pilar={activePilar} packs={packs[activePilar]} cart={cart} updateCart={updateCart} onCheckout={() => setActiveView('extras')} selectedCakes={selectedCakes} setSelectedCakes={setSelectedCakes} />
        </div>
      )}

      {activeView === 'add_more' && (
        <AddMoreSection 
          onSelectPilar={(p) => {
            setActivePilar(p);
            setActiveView('catalog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBack={() => setActiveView(cart.length > 0 ? 'extras' : 'home')}
        />
      )}

      {activeView === 'extras' && (
        <ExtrasSection 
           cart={cart} 
           updateCart={updateCart}
           selectedExtras={selectedExtras}
           setSelectedExtras={setSelectedExtras}
           packs={packs}
           onBack={() => setActiveView('catalog')}
           onAddMore={() => setActiveView('add_more')}
           onContinue={() => setActiveView('checkout')}
        />
      )}

      {activeView === 'edit_cart' && (
        <EditCartSection 
          cart={cart}
          updateCart={updateCart}
          selectedExtras={selectedExtras}
          setSelectedExtras={setSelectedExtras}
          packs={packs}
          onBack={() => setActiveView('checkout')}
          onAddMore={() => setActiveView('add_more')}
        />
      )}

      {activeView === 'checkout' && (
        <CheckoutSection
           cart={cart}
           selectedExtras={selectedExtras}
           packs={packs}
           selectedCakes={selectedCakes}
           onBack={() => setActiveView('edit_cart')}
        />
      )}

      {activeView === 'home' && (
        <>
          {/* PILARES / SERVICES */}
          <section id="pilares" className="bg-brand-orange py-20 px-6 md:px-10 relative overflow-hidden">
             
             {/* Decorative Icons */}
             <div className="absolute top-10 right-10 text-brand-cream opacity-80">
               <svg viewBox="0 0 100 100" width="30" height="30" fill="currentColor">
                 <path d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z" />
               </svg>
             </div>
             <div className="absolute bottom-20 left-10 text-[#FF99CC] opacity-40 transform -rotate-[15deg]">
               <Coffee size={56} strokeWidth={1.5} />
             </div>
             
             <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                
                {/* Left side: Heading */}
                <div className="lg:w-1/3 flex justify-center lg:justify-start text-center lg:text-left">
                   <h2 className="font-sans text-5xl md:text-6xl font-black text-brand-cream leading-none tracking-tight">
                     Hacé<br/>tu pedido...
                   </h2>
                </div>

                {/* Right side: 4 Pilares Columns */}
                <div className="w-full lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                   
                   {/* Column 1 - DESAYUNOS (24hs anticipación - más prominente) */}
                   <div className="flex flex-col items-center">
                     <button onClick={() => handlePilarSelect('desayunos')} className="w-24 h-24 mb-4 cursor-pointer hover:scale-110 transition-transform drop-shadow-lg overflow-hidden">
                       <img src="/desayuno-vector.png" alt="Desayuno" className="w-full h-full object-contain" />
                     </button>
                     <h3 className="font-sans font-black text-brand-cream text-2xl uppercase leading-none mb-4">Desa-<br/>yuno</h3>
                     <button onClick={() => handlePilarSelect('desayunos')} className="bg-brand-cream text-brand-pink font-bold uppercase tracking-widest py-3 px-8 rounded-full text-sm hover:bg-brand-pink hover:text-brand-cream transition-all shadow-lg hover:scale-105">
                       Ver box
                     </button>
                   </div>

                   {/* Column 2 - EVENTOS (3 días anticipación - más prominente) */}
                   <div className="flex flex-col items-center mt-6 md:mt-0">
                     <button onClick={() => handlePilarSelect('eventos')} className="w-24 h-24 mb-4 cursor-pointer hover:scale-110 transition-transform drop-shadow-lg overflow-hidden">
                       <img src="/lunchs-vector.png" alt="Lunch" className="w-full h-full object-contain" />
                     </button>
                     <h3 className="font-sans font-black text-brand-cream text-2xl uppercase leading-none mb-4">Lunch<br/>Eventos</h3>
                     <button onClick={() => handlePilarSelect('eventos')} className="bg-brand-cream text-brand-pink font-bold uppercase tracking-widest py-3 px-8 rounded-full text-sm hover:bg-brand-pink hover:text-brand-cream transition-all shadow-lg hover:scale-105">
                       Elegir
                     </button>
                   </div>

                   {/* Column 3 - PASTELERÍA (menos prominente) */}
                   <div className="flex flex-col items-center">
                     <button onClick={() => handlePilarSelect('pasteleria')} className="w-20 h-20 mb-4 cursor-pointer hover:scale-110 transition-transform overflow-hidden drop-shadow-lg">
                       <img src="/tortas-vector.png" alt="Pastelería" className="w-full h-full object-contain" />
                     </button>
                     <h3 className="font-sans font-black text-brand-cream text-xl uppercase leading-none mb-4 opacity-90">Mesa<br/>Dulce</h3>
                     <button onClick={() => handlePilarSelect('pasteleria')} className="bg-brand-cream text-brand-pink font-bold uppercase tracking-widest py-3 px-8 rounded-full text-sm hover:bg-brand-pink hover:text-brand-cream transition-all shadow-lg hover:scale-105">
                       Pedir
                     </button>
                   </div>

                   {/* Column 4 - SALADITOS (menos prominente) */}
                   <div className="flex flex-col items-center mt-6 md:mt-0">
                     <button onClick={() => handlePilarSelect('saladitos')} className="w-20 h-20 mb-4 cursor-pointer hover:scale-110 transition-transform overflow-hidden drop-shadow-lg">
                       <img src="/saladitos-vector.png" alt="Saladitos" className="w-full h-full object-contain" />
                     </button>
                     <h3 className="font-sans font-black text-brand-cream text-xl uppercase leading-none mb-4 opacity-90">Sala-<br/>ditos</h3>
                     <button onClick={() => handlePilarSelect('saladitos')} className="bg-brand-cream text-brand-pink font-bold uppercase tracking-widest py-3 px-8 rounded-full text-sm hover:bg-brand-pink hover:text-brand-cream transition-all shadow-lg hover:scale-105">
                       Armar
                     </button>
                   </div>

                </div>
             </div>
          </section>

          {/* WAVY MARQUEE */}
          <div className="w-full h-0 relative z-20 flex pointer-events-none overflow-visible justify-center" style={{ transform: 'translateY(-60px) rotate(-2deg) scale(1.05)' }}>
            <div className="flex whitespace-nowrap w-max opacity-95 ml-[-1000px] md:ml-0">
               {[...Array(3)].map((_, i) => (
                 <div key={i} className="flex shrink-0">
                   <svg viewBox="0 0 2000 120" width="2000" height="120" className="overflow-visible drop-shadow-md">
                     <path id={`wavepath-static-${i}`} d="M0,60 Q250,5 500,60 T1000,60 T1500,60 T2000,60" fill="none" stroke="#FF99CC" strokeWidth="50" />
                     <text fill="#FF5A00" className="font-sans font-black uppercase tracking-[0.1em] text-[18px]" dy="6">
                       <textPath href={`#wavepath-static-${i}`} startOffset="0" textLength="2000" lengthAdjust="spacing">
                         TRABAJAMOS CON PASIÓN PARA LLEVAR A TU MESA LA PASTELERÍA MÁS RICA. ☼ TRABAJAMOS CON PASIÓN PARA LLEVAR A TU MESA LA PASTELERÍA MÁS RICA. ☼ TRABAJAMOS CON PASIÓN PARA LLEVAR A TU MESA LA PASTELERÍA MÁS RICA. ☼ 
                       </textPath>
                     </text>
                   </svg>
                 </div>
               ))}
            </div>
          </div>

          {/* HERO SPLIT */}
          <section className="flex flex-col md:flex-row w-full min-h-[500px]">
             <div className="w-full md:w-1/2 bg-brand-cream flex items-center justify-center p-10 relative">
               {/* Left Side: Cream BG with Blob Image */}
               <div className="absolute top-10 right-10 text-brand-pink">
                 <Cake size={48} strokeWidth={1.5} />
               </div>
               <div className="absolute bottom-10 left-10 text-brand-pink opacity-80">
                 <Coffee size={40} strokeWidth={1.5} />
               </div>
               <div className="w-[80%] max-w-[400px] aspect-square overflow-hidden shape-arch shadow-xl flex items-center justify-center bg-brand-orange">
                 <video src="/videoweb.mov" playsInline muted autoPlay loop className="w-full h-full object-cover" />
               </div>
             </div>
             
             <div className="w-full md:w-1/2 bg-brand-lightorange flex flex-col items-center justify-center p-10 text-center relative border-l-4 border-brand-cream">
               <div className="absolute top-12 left-12 text-brand-cream opacity-50">
                 <svg width="20" height="20" viewBox="0 0 100 100" fill="currentColor">
                   <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
                 </svg>
               </div>
               <div className="absolute bottom-20 right-12 text-brand-cream opacity-50">
                 <svg width="30" height="30" viewBox="0 0 100 100" fill="currentColor">
                   <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
                 </svg>
               </div>
               
               <div className="absolute top-20 right-20 text-[#FF99CC] opacity-60 transform rotate-12">
                 <Croissant size={40} strokeWidth={1.5} />
               </div>
               
               <h1 className="font-sans text-5xl md:text-6xl font-black text-brand-cream mb-6 tracking-tight leading-tight max-w-md">
                 Momentos que se saborean!
               </h1>
               <p className="font-sans text-lg md:text-xl text-brand-cream font-medium max-w-md">
                 Desayunos, Lunch, Pastelería artesanal y más opciones para regalar o compartir en <strong>Buenos Aires, Zona Sur (Burzaco y alrededores)</strong>. ¡Te invitamos a probar nuestra variedad 100% artesanal!
               </p>
             </div>
          </section>

          {/* ABOUT */}
          <section id="about" className="bg-brand-cream py-20 px-6 md:px-10 flex flex-col md:flex-row items-center min-h-[500px] relative">
             <div className="absolute top-20 left-10 text-brand-orange opacity-40 transform -rotate-12">
               <Croissant size={60} strokeWidth={1.5} />
             </div>
             <div className="w-full md:w-1/2 p-4 md:p-12 mb-10 md:mb-0 relative z-10">
               <h2 className="font-sans text-5xl md:text-6xl font-black text-brand-orange mb-6">¿Quién soy?</h2>
               <p className="font-sans text-lg text-brand-orange font-medium mb-6 leading-relaxed max-w-sm">
                 Hola soy Cami! Cocino desde toda la vida, pues, familia de panaderos. Encontré mi pasión por lo artesanal, dándole un toque mágico a cada uno de mis productos.
               </p>
               <p className="font-script italic text-4xl mb-6 max-w-sm leading-tight text-brand-pink">
                 Priorizo la calidad y la frescura de los ingredientes y el amor a cada preparación.
               </p>
               <p className="font-sans text-lg text-brand-orange font-medium mb-6 leading-relaxed max-w-sm">
                 Los invito a disfrutar de mi mundo de sabores.
               </p>
             </div>
             
             <div className="w-full md:w-1/2 relative flex flex-col items-center p-4">
<div className="w-[90%] max-w-[400px] aspect-square shape-leaf-2 overflow-hidden rounded-[40px] shadow-xl">
                 <img referrerPolicy="no-referrer" src="/cami.png" alt="Cami" className="w-full h-full object-cover object-top" />
               </div>
             </div>
          </section>

        </>
      )}

      {/* FOOTER SPLIT */}
      <footer id="contact" className="flex flex-col md:flex-row min-h-[350px]">
        
        {/* Left Side: Flowers */}
        <div className="w-full md:w-1/2 bg-flowers flex items-center justify-center p-10 relative">
           <div className="bg-brand-cream border-4 border-brand-orange rounded-[30px] p-8 text-center max-w-sm w-full relative z-10 shadow-[8px_8px_0px_0px_rgba(255,102,177,1)]">
              <h3 className="font-sans font-black text-3xl text-brand-orange mb-6 tracking-wide">¡Seguime!</h3>
              <div className="flex justify-center gap-6 mb-6">
                <a href="https://www.instagram.com/tardesde.te/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-brand-pink rounded-full flex items-center justify-center text-brand-cream hover:scale-110 transition-transform shadow-md">
                  <Instagram size={24} />
                </a>
                <a href="https://www.tiktok.com/@tardesdete?_r=1&_t=ZS-95vHeUoYMKL" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-brand-pink rounded-full flex items-center justify-center text-brand-cream hover:scale-110 transition-transform shadow-md">
                  <TiktokIcon size={22} />
                </a>
              </div>
              <p className="text-brand-orange font-medium text-sm">
                Burzaco, Zona Sur GBA<br/>Envíos por remis.
              </p>
           </div>
        </div>

        {/* Right Side: Solid Pink */}
        <div className="w-full md:w-1/2 bg-brand-pink flex flex-col justify-center items-center text-center p-10 relative">
          <div className="absolute top-8 right-8 text-brand-cream opacity-80 transform rotate-45">
            <Cake size={40} strokeWidth={1.5} />
          </div>
          <div className="absolute bottom-8 left-8 text-brand-cream opacity-80 transform -rotate-12">
            <Croissant size={50} strokeWidth={1.5} />
          </div>
          <h2 className="font-sans font-black text-4xl text-brand-cream mb-6 leading-tight relative Z-10">
            Consultas Libres /<br/>Pedidos Custom
          </h2>
          <p className="font-sans text-brand-cream font-medium text-lg max-w-sm mb-8 leading-relaxed">
            Si querés algo personalizado, diferente o tenés una duda, escribinos y te respondemos al toque.
          </p>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="bg-[#FF99CC] text-brand-orange font-black uppercase tracking-widest py-3 px-8 rounded-full border-[3px] border-brand-orange shadow-[4px_4px_0_0_rgba(255,90,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0_0_rgba(255,90,0,1)] transition-all">
            Chat en línea
          </a>
        </div>
      </footer>

    </div>
  );
}


// --- SUBCOMPONENTS ---

function CatalogSection({
  pilar,
  packs,
  cart,
  updateCart,
  onCheckout,
  selectedCakes,
  setSelectedCakes
}: {
  pilar: 'desayunos' | 'eventos' | 'pasteleria' | 'saladitos',
  packs: any[],
  cart: {id: string, quantity: number}[],
  updateCart: (id: string, delta: number) => void,
  onCheckout: () => void,
  selectedCakes: Record<string, string[]>,
  setSelectedCakes: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
}) {

  const handlePasteleriaSelect = (type: 'pf' | 'torta', value: string) => {
    const prevItem = cart.find(item => item.id.startsWith(type === 'pf' ? 'pf-' : 'torta-'));
    if (prevItem && prevItem.id !== value) {
      updateCart(prevItem.id, -prevItem.quantity);
    }
    if (value) {
      updateCart(value, 1);
    }
  };

  const getPilarTitle = () => {
    switch (pilar) {
      case 'desayunos': return 'Desayunos & Box';
      case 'eventos': return 'Lunch para Eventos';
      case 'pasteleria': return 'Pastelería & Tortas';
      case 'saladitos': return 'Saladitos (Arma tu pack)';
    }
  };

  const getPilarSubtitle = () => {
    return pilar === 'desayunos' || pilar === 'pasteleria' || pilar === 'saladitos' 
      ? <><Clock size={16}/> Reservá hasta 24 hs antes</> 
      : <><Calendar size={16}/> Reservá con 3 días de anticipación</>;
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 relative">
      <div className="text-center mb-16">
        <h2 className="font-script text-5xl md:text-6xl font-bold text-brand-orange mb-4 tracking-tight">
          {getPilarTitle()}
        </h2>
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-brand-pink bg-brand-pink/10 border-2 border-brand-pink/20`}>
           {getPilarSubtitle()}
        </span>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative pb-20">
        {pilar === 'pasteleria' ? (
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Petit Fours Card */}
                <div className={`bg-white rounded-[40px] p-6 md:p-8 flex flex-col border ${cart.some(p => p.id.startsWith('pf-')) ? 'border-brand-pink ring-4 ring-brand-pink/10 shadow-lg' : 'border-brand-pink/20 hover:shadow-lg transition-all'}`}>
                   <div className="h-48 relative overflow-hidden mb-6 rounded-3xl bg-brand-orange/5 shape-arch">
                     <img src="/petit-four.jpeg" alt="Petit Fours" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                   </div>
                   <h3 className="font-sans font-bold text-3xl text-brand-orange mb-3">Petit Fours</h3>
                   <p className="text-brand-orange/80 font-medium mb-6 flex-grow">
                     Pequeñas piezas (4-6 cm). En 1 docena podés elegir hasta 3 sabores en total.
                   </p>
                   <div className="space-y-3">
                     <label className="text-xs font-bold uppercase tracking-widest text-brand-pink ml-2">Seleccionar Variedad</label>
                     <select 
                       className="w-full bg-brand-cream/30 border-2 border-brand-pink/20 rounded-2xl p-4 text-brand-orange font-medium focus:border-brand-pink focus:outline-none focus:ring-0 appearance-none"
                       value={cart.find(p => p.id.startsWith('pf-'))?.id || ""}
                       onChange={(e) => handlePasteleriaSelect('pf', e.target.value)}
                     >
                       <option value="">(Ninguno)</option>
                       {packs.filter(p => p.id.startsWith('pf-')).map(p => (
                         <option key={p.id} value={p.id}>{p.name} - {p.price}</option>
                       ))}
                     </select>
                     
                     {(() => {
                       const selectedPf = cart.find(p => p.id.startsWith('pf-'));
                       if(selectedPf) {
                          return (
                            <div className="flex justify-center mt-4 bg-brand-cream/50 rounded-full p-2 border border-brand-pink/20 mx-auto w-max">
                              <button onClick={() => updateCart(selectedPf.id, -1)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-brand-orange hover:bg-brand-pink hover:text-white transition-colors">
                                  <Minus size={20} />
                              </button>
                              <span className="font-bold text-xl text-brand-orange w-10 text-center flex items-center justify-center">{selectedPf.quantity}</span>
                              <button onClick={() => updateCart(selectedPf.id, 1)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-brand-orange hover:bg-brand-pink hover:text-white transition-colors shadow-sm">
                                <Plus size={20} />
                              </button>
                            </div>
                          );
                       }
                       return null;
                     })()}
                   </div>
                </div>

                {/* Tortas Card */}
                <div className={`bg-white rounded-[40px] p-6 md:p-8 flex flex-col border ${cart.some(p => p.id.startsWith('torta-')) ? 'border-brand-pink ring-4 ring-brand-pink/10 shadow-lg' : 'border-brand-pink/20 hover:shadow-lg transition-all'}`}>
                   <div className="h-48 relative overflow-hidden mb-6 rounded-3xl bg-brand-orange/5 shape-leaf-1">
                     <img src="/tortas.jpeg" alt="Tortas" className="w-full h-full object-cover" />
                   </div>
                   <h3 className="font-sans font-bold text-3xl text-brand-orange mb-3">Tortas</h3>
                   <p className="text-brand-orange/80 font-medium mb-6 flex-grow">
                     Tartas y tortas enteras para tu mesa dulce.
                   </p>
                   <div className="space-y-3">
                     <label className="text-xs font-bold uppercase tracking-widest text-brand-pink ml-2">Seleccionar Torta</label>
                     <select 
                       className="w-full bg-brand-cream/30 border-2 border-brand-pink/20 rounded-2xl p-4 text-brand-orange font-medium focus:border-brand-pink focus:outline-none focus:ring-0 appearance-none"
                       value={cart.find(p => !p.id.startsWith('pf-'))?.id || ""}
                       onChange={(e) => handlePasteleriaSelect('torta', e.target.value)}
                     >
                       <option value="">(Ninguna)</option>
                       {packs.filter(p => !p.id.startsWith('pf-')).map(p => (
                         <option key={p.id} value={p.id}>{p.name} - {p.price}</option>
                       ))}
                     </select>
                     
                     {(() => {
                       const selectedTorta = cart.find(p => p.id.startsWith('torta-'));
                       if(selectedTorta) {
                          return (
                            <div className="flex justify-center mt-4 bg-brand-cream/50 rounded-full p-2 border border-brand-pink/20 mx-auto w-max">
                              <button onClick={() => updateCart(selectedTorta.id, -1)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-brand-orange hover:bg-brand-pink hover:text-white transition-colors">
                                  <Minus size={20} />
                              </button>
                              <span className="font-bold text-xl text-brand-orange w-10 text-center flex items-center justify-center">{selectedTorta.quantity}</span>
                              <button onClick={() => updateCart(selectedTorta.id, 1)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-brand-orange hover:bg-brand-pink hover:text-white transition-colors shadow-sm">
                                <Plus size={20} />
                              </button>
                            </div>
                          );
                       }
                       return null;
                     })()}
                   </div>
                </div>
              </div>

              {cartCount > 0 && (
                <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center animate-in slide-in-from-bottom-10 fade-in duration-300">
                  <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); onCheckout(); }} className="bg-brand-pink text-white font-bold px-8 py-3 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-2 border-2 border-white tracking-widest uppercase text-sm">
                    <span>Continuar ({cartCount})</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
              {packs && packs.map((pack, index) => {
                const shapes = ['shape-arch', 'shape-leaf-1', 'shape-teardrop', 'shape-arch-inverted', 'shape-leaf-2', 'shape-blob-1', 'shape-starburst', 'shape-pill-left', 'shape-clover', 'shape-blob-2'];
                const shapeClass = shapes[index % shapes.length];
                const cartItem = cart.find(c => c.id === pack.id);
                const quantity = cartItem ? cartItem.quantity : 0;
                const isSelected = quantity > 0;
                return (
                <div key={pack.id} 
                     className={`flex flex-col p-4 border rounded-[32px] transition-all duration-300 group hover:-translate-y-1 bg-white
                   ${isSelected ? 'border-brand-pink ring-4 ring-brand-pink/10 shadow-lg' : 'border-brand-pink/20 hover:shadow-lg'}`}>
                  <div className="relative mb-6">
                    <div className={`h-56 overflow-hidden shrink-0 bg-brand-orange/5 ${shapeClass}`}>
                      <img src={pack.img} alt={pack.name} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-brand-pink px-3 py-1.5 rounded-full shadow-sm">
                        {pack.pax}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col flex-grow px-2 pb-2">
                     <h4 className="font-sans font-bold text-2xl text-brand-orange mb-3">{pack.name}</h4>
                     <p className="text-sm text-brand-orange/80 leading-relaxed mb-6 font-medium flex-grow">
                       {pack.description}
                     </p>
                     <div className="mt-auto flex items-center justify-between border-t border-brand-pink/20 pt-4 gap-4">
                       <span className="font-black text-2xl text-brand-orange">
                         {pack.price}
                       </span>
                       <div className="flex items-center gap-3 bg-brand-cream/50 rounded-full p-1 border border-brand-pink/20">
                          <button
                            onClick={(e) => { e.stopPropagation(); updateCart(pack.id, Math.max(0, quantity - 1)); }}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-brand-orange hover:bg-brand-pink hover:text-white transition-colors"
                          >
                             <Minus size={20} />
                          </button>
                          <span className="font-bold text-xl text-brand-orange w-4 text-center">{quantity}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateCart(pack.id, quantity + 1); }}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-brand-orange hover:bg-brand-pink hover:text-white transition-colors shadow-sm"
                          >
                            <Plus size={20} />
                          </button>
                       </div>
                     </div>
                     {pilar === 'desayunos' && isSelected && DESAYUNO_TORTA_COUNT[pack.id] && (
                       <div className="mt-4 pt-4 border-t border-brand-pink/10 space-y-2">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-brand-pink ml-1">
                           🍰 Elegí tu torta {DESAYUNO_TORTA_COUNT[pack.id] > 1 ? `(${DESAYUNO_TORTA_COUNT[pack.id]} opciones)` : ''}
                         </p>
                         {Array.from({ length: DESAYUNO_TORTA_COUNT[pack.id] }).map((_, slotIdx) => (
                           <select
                             key={slotIdx}
                             className="w-full bg-brand-cream/40 border-2 border-brand-pink/30 rounded-2xl px-4 py-2.5 text-brand-orange font-medium text-sm focus:border-brand-pink focus:outline-none appearance-none"
                             value={(selectedCakes[pack.id] || [])[slotIdx] || ""}
                             onChange={(e) => {
                               setSelectedCakes(prev => {
                                 const current = [...(prev[pack.id] || [])];
                                 current[slotIdx] = e.target.value;
                                 return { ...prev, [pack.id]: current };
                               });
                             }}
                           >
                             <option value="">— Seleccionar torta {DESAYUNO_TORTA_COUNT[pack.id] > 1 ? slotIdx + 1 : ''} —</option>
                             {TORTAS_DESAYUNO.map(t => (
                               <option key={t} value={t}>{t}</option>
                             ))}
                           </select>
                         ))}
                       </div>
                     )}
                  </div>
                </div>
                );
              })}
            </div>
          )}
          {pilar !== 'pasteleria' && cartCount > 0 && (
             <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center animate-in slide-in-from-bottom-10 fade-in duration-300 pointer-events-none">
               <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); onCheckout(); }} className="bg-brand-pink text-white font-bold px-8 py-3 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-2 border-2 border-white tracking-widest uppercase pointer-events-auto text-sm">
                 <span>Continuar ({cartCount})</span>
                 <ArrowRight size={18} />
               </button>
             </div>
          )}
        </div>
    </div>
  );
}

function ExtrasSection({ 
  cart, 
  updateCart,
  selectedExtras,
  setSelectedExtras,
  packs,
  onBack,
  onAddMore,
  onContinue
}: { 
  cart: {id: string, quantity: number}[], 
  updateCart: (id: string, delta: number) => void,
  selectedExtras: {id: string, quantity: number}[],
  setSelectedExtras: React.Dispatch<React.SetStateAction<{id: string, quantity: number}[]>>,
  packs: Record<string, Pack[]>,
  onBack: () => void,
  onAddMore: () => void,
  onContinue: () => void
}) {
  const updateExtraQuantity = (extraId: string, quantity: number) => {
    setSelectedExtras(prev => {
      const existing = prev.find(item => item.id === extraId);
      if (existing) {
        if (quantity === 0) {
          return prev.filter(item => item.id !== extraId);
        }
        return prev.map(item => item.id === extraId ? { ...item, quantity } : item);
      } else if (quantity > 0) {
        return [...prev, { id: extraId, quantity }];
      }
      return prev;
    });
  };

  return (
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-brand-cream rounded-[40px] p-8 md:p-12 mb-8 shadow-sm border border-brand-pink/10">
            <h3 className="font-sans text-3xl font-bold text-brand-orange mb-3 text-center">¿Agregamos algo más?</h3>
            <p className="text-brand-orange/80 text-base font-medium mb-10 text-center text-balance">
              Podés sumar adicionales a tu pedido principal para que sea aún más completo.
            </p>

            <div className="space-y-4 mb-12">
              {EXTRAS_AVAILABLE.map((extra) => {
                const extraItem = selectedExtras.find(e => e.id === extra.id);
                const quantity = extraItem ? extraItem.quantity : 0;
                return (
                 <div key={extra.id} 
                      className={`flex flex-col sm:flex-row items-center justify-between p-5 rounded-3xl border-2 transition-all duration-300 gap-4
                   ${quantity > 0 ? 'border-brand-pink bg-white shadow-md transform -translate-y-0.5' : 'border-transparent bg-white/50 hover:bg-white'}
                 `}>
                   <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full">
                     <span className="font-bold text-brand-orange font-sans text-lg text-center sm:text-left">{extra.name}</span>
                   </div>
                   <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                     <span className="font-bold text-brand-pink text-lg bg-brand-pink/10 px-4 py-1.5 rounded-full whitespace-nowrap">{extra.price}</span>
                     
                     <div className="flex items-center gap-3 bg-brand-cream/50 rounded-full p-1 border border-brand-pink/20 shrink-0">
                        <button 
                          onClick={() => updateExtraQuantity(extra.id, Math.max(0, quantity - 1))} 
                          className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-brand-orange hover:bg-brand-pink hover:text-white transition-colors"
                        >
                           <Minus size={20} />
                        </button>
                        <span className="font-bold text-xl text-brand-orange w-4 text-center">{quantity}</span>
                        <button 
                          onClick={() => updateExtraQuantity(extra.id, quantity + 1)} 
                          className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-brand-orange hover:bg-brand-pink hover:text-white transition-colors shadow-sm"
                        >
                          <Plus size={20} />
                        </button>
                     </div>
                   </div>
                 </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-between items-center border-t border-brand-pink/20 pt-8">
              <button 
                onClick={onBack} 
                className="text-brand-orange text-sm font-bold uppercase tracking-wider hover:text-brand-pink transition-colors"
               >
                 ← Cambiar combo principal
              </button>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                 <button 
                   onClick={onAddMore} 
                   className="w-full sm:w-auto bg-white px-6 py-3 rounded-full text-brand-pink font-black uppercase tracking-widest border-2 border-brand-pink hover:bg-brand-pink/5 transition-colors text-sm flex justify-center items-center"
                 >
                   + Agregar más productos
                 </button>
                 <button 
                   onClick={onContinue} 
                   className="w-full sm:w-auto bg-brand-pink px-8 py-3 rounded-full text-white font-black uppercase tracking-widest border-2 border-brand-pink hover:bg-brand-orange hover:border-brand-orange transition-colors text-sm flex justify-center items-center gap-2"
                 >
                   Continuar →
                 </button>
              </div>
            </div>
          </div>
        </div>
  );
}

function CheckoutSection({
  cart,
  selectedExtras,
  packs,
  selectedCakes,
  onBack
}: {
  cart: {id: string, quantity: number}[],
  selectedExtras: {id: string, quantity: number}[],
  packs: Record<string, Pack[]>,
  selectedCakes: Record<string, string[]>,
  onBack: () => void
}) {
  const allPacks = Object.values(packs).flat();
  return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

           <div className="relative shadow-xl rounded-[40px] overflow-hidden border border-brand-pink/20 bg-brand-pink/10 backdrop-blur-sm z-10">

             <div className="relative z-10 flex flex-col p-8 md:p-12">
               {/* Order Summary */}
             <div className="mb-10 p-6 bg-white rounded-3xl border border-brand-pink/20 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-sm">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-orange mb-2">Tu pedido principal:</p>
                  <p className="font-bold text-brand-orange text-xl leading-none">
                    {cart.map(item => {
                       const p = allPacks.find(p => p.id === item.id);
                       return `${item.quantity}x ${p?.name}`;
                    }).join(' + ')}
                  </p>
                  {selectedExtras.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedExtras.map(ex => {
                        const E = EXTRAS_AVAILABLE.find(e => e.id === ex.id);
                        return <span key={ex.id} className="text-[10px] bg-brand-pink text-brand-cream font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                          +{ex.quantity} {E?.name.split(' (')[0]}
                        </span>
                      })}
                    </div>
                  )}
                </div>
                <button onClick={onBack} className="text-[10px] uppercase tracking-widest font-bold text-brand-orange hover:text-brand-cream bg-brand-cream hover:bg-brand-pink px-4 py-2 rounded-full transition-colors shrink-0">
                  Editar Selección
                </button>
             </div>

             <div className="mb-8">
               <h3 className="font-sans text-3xl font-bold text-brand-orange mb-2">Completar Datos</h3>
               <p className="text-brand-orange text-base font-medium">Llena este formulario y nos contactaremos por WhatsApp.</p>
             </div>

             <OrderForm
                cart={cart}
                selectedExtras={selectedExtras}
                packs={packs}
                selectedCakes={selectedCakes}
             />
           </div>
           </div>
        </div>
  );
}

// --- FORMS ---

function OrderForm({
  cart,
  selectedExtras,
  packs,
  selectedCakes,
}: {
  cart: {id: string, quantity: number}[],
  selectedExtras: {id: string, quantity: number}[],
  packs: Record<string, Pack[]>,
  selectedCakes: Record<string, string[]>,
}) {
  const allPacks = Object.values(packs).flat();

  const hasDesayunos = cart.some(item => packs.desayunos?.some(p => p.id === item.id));
  const hasEventos = cart.some(item => packs.eventos?.some(p => p.id === item.id));

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    fecha: "",
    hora: "",
    direccion: "",
    pax: "",
    extras: ""
  });
  const [deliveryType, setDeliveryType] = useState<'envio' | 'retiro'>('envio');
  const [popup, setPopup] = useState<{ open: boolean; title: string; message: string; type: 'hora' | 'fecha' } | null>(null);

  const getSubtotal = () => {
    let total = 0;
    cart.forEach(item => {
      const p = allPacks.find(pack => pack.id === item.id);
      if (p && !p.price.toLowerCase().includes('consultar')) {
        total += parseInt(p.price.replace(/[^0-9]/g, '')) * item.quantity;
      }
    });
    selectedExtras.forEach(exItem => {
      const extraObj = EXTRAS_AVAILABLE.find(e => e.id === exItem.id);
      if (extraObj) {
        total += parseInt(extraObj.price.replace(/[^0-9]/g, '')) * exItem.quantity;
      }
    });
    return `$${total.toLocaleString('es-AR')}`;
  };

  const validateTime = (time: string): boolean => {
    if (!time) return true;
    const [h, m] = time.split(':').map(Number);
    const minutes = h * 60 + m;
    if (hasDesayunos) return minutes >= 8 * 60 + 45 && minutes <= 10 * 60;
    return minutes >= 17 * 60 && minutes <= 19 * 60;
  };

  const validateDate = (date: string): boolean => {
    if (!date) return true;
    const selected = new Date(date + 'T00:00:00');
    const now = new Date();
    const diffHours = (selected.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hasDesayunos && !hasEventos) return diffHours >= 24;
    return diffHours >= 72;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'hora' && value) {
      if (!validateTime(value)) {
        setFormData(prev => ({ ...prev, hora: value }));
        const range = hasDesayunos ? '8:45 hs a 10:00 hs' : '17:00 hs a 19:00 hs';
        setPopup({
          open: true,
          title: '¡Ups! Ese horario está fuera de mi alcance',
          message: `No llego a cocinar todo a tiempo ✨ Los pedidos se entregan de ${range}. ¡Seleccioná otro horario o consultame por WhatsApp!`,
          type: 'hora'
        });
        return;
      }
    }
    if (name === 'fecha' && value) {
      if (!validateDate(value)) {
        setFormData(prev => ({ ...prev, fecha: value }));
        const minDays = hasDesayunos && !hasEventos ? '24 horas' : '3 días';
        setPopup({
          open: true,
          title: '¡Ups! Necesito más tiempo para preparar todo',
          message: `Para que todo quede riquísimo necesito al menos ${minDays} de anticipación 🍰 ¡Elegí otra fecha o consultame por WhatsApp!`,
          type: 'fecha'
        });
        return;
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.hora && !validateTime(formData.hora)) {
      const range = hasDesayunos ? '8:45 hs a 10:00 hs' : '17:00 hs a 19:00 hs';
      setPopup({ open: true, title: '¡Ups! Ese horario está fuera de mi alcance', message: `Los pedidos se entregan de ${range}.`, type: 'hora' });
      return;
    }
    if (formData.fecha && !validateDate(formData.fecha)) {
      const minDays = hasDesayunos && !hasEventos ? '24 horas' : '3 días';
      setPopup({ open: true, title: '¡Ups! Necesito más tiempo', message: `Necesito al menos ${minDays} de anticipación.`, type: 'fecha' });
      return;
    }

    const packNames = cart.length > 0
      ? cart.map(item => {
          const p = allPacks.find(p => p.id === item.id);
          return `${item.quantity}x ${p?.name} (${p?.price ?? 'Consultar'})`;
        }).filter(Boolean).join(' + ')
      : "Pedido vacío";

    let text = `Hola Tardes de Té! Quiero hacer un pedido:\n\n`;
    text += `*Pedido principal:* ${packNames}\n`;

    const cakeEntries = Object.entries(selectedCakes).filter(([, cakes]) => cakes.some(c => c));
    if (cakeEntries.length > 0) {
      cakeEntries.forEach(([desayunoId, cakes]) => {
        const desayunoName = packs.desayunos?.find(p => p.id === desayunoId)?.name || desayunoId;
        const cakeList = cakes.filter(c => c).join(', ');
        text += `*Torta/s para ${desayunoName}:* ${cakeList}\n`;
      });
    }

    if (selectedExtras.length > 0) {
      const extraNames = selectedExtras.map(exItem => {
        const name = EXTRAS_AVAILABLE.find(ex => ex.id === exItem.id)?.name;
        return `${exItem.quantity}x ${name}`;
      }).join(', ');
      text += `*Adicionales:* ${extraNames}\n`;
    }

    text += `*Fecha:* ${formData.fecha} · *Hora:* ${formData.hora} hs\n`;
    text += `*Entrega:* ${deliveryType === 'retiro' ? 'Retiro en local (Aristobulo Del Valle 611 esq. 25 de Mayo, Burzaco)' : `Envío a ${formData.direccion}`}\n`;

    if (formData.pax) text += `*Personas / Pack:* ${formData.pax}\n`;
    if (formData.extras) text += `*Extra / Detalle:* ${formData.extras}\n`;

    text += `*Total estimado:* ${getSubtotal()}\n`;
    if (deliveryType === 'envio') text += `*Valor envío:* Consultar\n`;
    text += `\n*Nombre:* ${formData.nombre}\n`;
    text += `*Teléfono:* ${formData.telefono}\n`;

    const orderData = {
      customer_name: formData.nombre,
      customer_phone: formData.telefono,
      delivery_date: formData.fecha,
      delivery_time: formData.hora,
      delivery_address: deliveryType === 'retiro' ? 'RETIRO EN LOCAL' : formData.direccion,
      pax: formData.pax || null,
      special_notes: formData.extras || null,
      products: cart.map(item => ({
        id: item.id,
        name: allPacks.find(p => p.id === item.id)?.name || item.id,
        quantity: item.quantity,
        price: allPacks.find(p => p.id === item.id)?.price || 0
      })),
      extras: selectedExtras.map(exItem => ({
        id: exItem.id,
        name: EXTRAS_AVAILABLE.find(ex => ex.id === exItem.id)?.name || exItem.id,
        quantity: exItem.quantity,
        price: EXTRAS_AVAILABLE.find(ex => ex.id === exItem.id)?.price || 0
      })),
      subtotal: getSubtotal(),
      status: 'pendiente',
      created_at: new Date().toISOString()
    };

    saveOrderToSupabase(orderData).catch(err => console.error('Error guardando pedido:', err));

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const inputClasses = "w-full bg-white px-5 py-3 rounded-2xl border-2 border-brand-pink/20 focus:border-brand-pink focus:ring-0 outline-none transition-all placeholder:text-brand-orange/40 text-brand-orange text-sm shadow-sm font-medium";
  const labelClasses = "block text-[10px] font-bold text-brand-orange mb-2 ml-2 uppercase tracking-wide";

  const timeHint = hasDesayunos
    ? "Desayunos: llegada entre las 8:45 y las 10:00 hs"
    : "Lunchs / otros: entrega entre las 17:00 y las 19:00 hs";

  return (
    <>
      {popup?.open && (
        <FriendlyPopup
          title={popup.title}
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup(null)}
          onConsult={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
        />
      )}
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Nombre completo *</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-pink" size={16} />
            <input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} className={`${inputClasses} pl-10`} placeholder="Camila Vega" />
          </div>
        </div>
        <div>
          <label className={labelClasses}>Teléfono *</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-pink" size={16} />
            <input required type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className={`${inputClasses} pl-10`} placeholder="11 4444 5678" />
          </div>
        </div>
      </div>

      {/* Delivery type switch */}
      <div>
        <label className={labelClasses}>Tipo de entrega *</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setDeliveryType('envio')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all border-2 ${deliveryType === 'envio' ? 'bg-brand-pink text-white border-brand-pink shadow-md' : 'bg-white text-brand-orange border-brand-pink/20 hover:border-brand-pink/50'}`}
          >
            <Truck size={16} /> Envío
          </button>
          <button
            type="button"
            onClick={() => setDeliveryType('retiro')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all border-2 ${deliveryType === 'retiro' ? 'bg-brand-pink text-white border-brand-pink shadow-md' : 'bg-white text-brand-orange border-brand-pink/20 hover:border-brand-pink/50'}`}
          >
            <Store size={16} /> Retiro
          </button>
        </div>
        {deliveryType === 'retiro' && (
          <div className="mt-3 bg-brand-orange/5 rounded-2xl p-4 border border-brand-orange/20 text-sm text-brand-orange leading-relaxed">
            🏡 <strong>Aristobulo Del Valle 611 esq. 25 de Mayo, Burzaco</strong><br />
            <span className="text-brand-orange/70 text-xs">Horario Comercial: 9hs a 12hs · 17hs a 19hs</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Fecha del pedido *</label>
          <input required type="date" name="fecha" value={formData.fecha} onChange={handleChange} className={inputClasses} />
          <p className="text-[10px] text-brand-orange ml-2 mt-1.5 font-medium">
            {hasDesayunos && !hasEventos ? 'Desayunos: mínimo 24 hs de anticipación.' : 'Mínimo 3 días de anticipación.'}
          </p>
        </div>
        <div>
          <label className={labelClasses}>Hora aprox *</label>
          <input required type="time" name="hora" value={formData.hora} onChange={handleChange} className={inputClasses} />
          <p className="text-[10px] text-brand-orange ml-2 mt-1.5 font-medium">{timeHint}</p>
        </div>
      </div>

      {deliveryType === 'envio' && (
        <div>
          <label className={labelClasses}>Dirección de entrega (Calle, Número, Localidad) *</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-pink" size={16} />
            <input required type="text" name="direccion" value={formData.direccion} onChange={handleChange} className={`${inputClasses} pl-10`} placeholder="Ej: San Martín 123, Burzaco" />
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Cantidad personas (Opcional)</label>
            <input type="text" name="pax" value={formData.pax} onChange={handleChange} className={inputClasses} placeholder="Ej: 20 adultos" />
          </div>
      </div>

      <div>
        <label className={labelClasses}>Detalles / Extras</label>
        <textarea name="extras" value={formData.extras} onChange={handleChange} rows={2} className={`${inputClasses} resize-none`} placeholder="Opciones adicionales, restricciones..." />
      </div>

      <div className="mt-6 mb-4 space-y-2">
        <div className="bg-brand-pink/10 rounded-2xl p-5 flex justify-between items-center border border-brand-pink/20">
           <span className="font-bold text-brand-orange uppercase tracking-widest text-xs">Total estimado:</span>
           <span className="font-black text-2xl text-brand-pink">{getSubtotal()}</span>
        </div>
        <p className="text-[11px] text-brand-orange/80 text-center font-medium leading-tight">
          {deliveryType === 'envio' ? '* El envío se cobra aparte y será cotizado al confirmar el pedido por WhatsApp.' : '* Retiro sin costo adicional de envío.'}
        </p>
      </div>

       <button type="submit" className="w-full mt-4 bg-brand-pink text-white font-white font-bold uppercase tracking-widest py-3 px-8 rounded-full shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 text-sm">
         <WhatsappIcon size={20} />
         Pedir por WhatsApp
       </button>
    </form>
    </>
  );
}

function AddMoreSection({ onSelectPilar, onBack }: { onSelectPilar: (pilar: 'desayunos'|'eventos'|'pasteleria'|'saladitos') => void, onBack: () => void }) {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={onBack} className="text-brand-orange font-bold uppercase tracking-wider text-sm hover:text-brand-pink transition-colors mb-8">
        ← Volver
      </button>
      <h2 className="text-4xl font-black text-brand-orange text-center mb-10">¿Qué más querés sumar?</h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
         <div className="flex flex-col items-center bg-white rounded-3xl p-6 shadow-sm border border-brand-pink/20 hover:border-brand-pink cursor-pointer transition-all hover:-translate-y-1 group" onClick={() => onSelectPilar('desayunos')}>
           <div className="w-20 h-20 mb-4 rounded-full overflow-hidden bg-brand-cream/80 flex items-center justify-center mx-auto">
             <img src="/desayuno-vector.png" alt="Desayunos" className="w-full h-full object-contain" />
           </div>
           <h3 className="font-sans font-black text-brand-orange text-lg uppercase mb-1">Desayunos</h3>
         </div>
         <div className="flex flex-col items-center bg-white rounded-3xl p-6 shadow-sm border border-brand-pink/20 hover:border-brand-pink cursor-pointer transition-all hover:-translate-y-1 group" onClick={() => onSelectPilar('eventos')}>
           <div className="w-20 h-20 mb-4 rounded-full overflow-hidden bg-brand-cream/80 flex items-center justify-center mx-auto">
             <img src="/lunchs-vector.png" alt="Eventos" className="w-full h-full object-contain" />
           </div>
           <h3 className="font-sans font-black text-brand-orange text-lg uppercase mb-1">Eventos</h3>
         </div>
         <div className="flex flex-col items-center bg-white rounded-3xl p-6 shadow-sm border border-brand-pink/20 hover:border-brand-pink cursor-pointer transition-all hover:-translate-y-1 group" onClick={() => onSelectPilar('pasteleria')}>
           <div className="w-20 h-20 mb-4 rounded-full overflow-hidden bg-brand-cream/80 flex items-center justify-center mx-auto">
             <img src="/tortas-vector.png" alt="Pastelería" className="w-full h-full object-contain" />
           </div>
           <h3 className="font-sans font-black text-brand-orange text-lg uppercase mb-1">Pastelería</h3>
         </div>
         <div className="flex flex-col items-center bg-white rounded-3xl p-6 shadow-sm border border-brand-pink/20 hover:border-brand-pink cursor-pointer transition-all hover:-translate-y-1 group" onClick={() => onSelectPilar('saladitos')}>
           <div className="w-20 h-20 mb-4 rounded-full overflow-hidden bg-brand-cream/80 flex items-center justify-center mx-auto">
             <img src="/saladitos-vector.png" alt="Saladitos" className="w-full h-full object-contain" />
           </div>
           <h3 className="font-sans font-black text-brand-orange text-lg uppercase mb-1">Saladitos</h3>
         </div>
      </div>
    </div>
  );
}

function EditCartSection({
  cart,
  updateCart,
  selectedExtras,
  setSelectedExtras,
  packs,
  onBack,
  onAddMore
}: {
  cart: {id: string, quantity: number}[],
  updateCart: (id: string, delta: number) => void,
  selectedExtras: {id: string, quantity: number}[],
  setSelectedExtras: React.Dispatch<React.SetStateAction<{id: string, quantity: number}[]>>,
  packs: Record<string, Pack[]>,
  onBack: () => void,
  onAddMore: () => void
}) {
  const allPacks = Object.values(packs).flat();

  const updateExtraQuantity = (extraId: string, delta: number) => {
    setSelectedExtras(prev => {
      const existing = prev.find(item => item.id === extraId);
      if (existing) {
        const newQuantity = existing.quantity + delta;
        if (newQuantity <= 0) {
          return prev.filter(item => item.id !== extraId);
        }
        return prev.map(item => item.id === extraId ? { ...item, quantity: newQuantity } : item);
      } else if (delta > 0) {
        return [...prev, { id: extraId, quantity: delta }];
      }
      return prev;
    });
  };

  const removeItem = (id: string) => {
    const current = cart.find(i => i.id === id);
    if(current) updateCart(id, -current.quantity);
  };

  const removeExtra = (id: string) => {
    setSelectedExtras(prev => prev.filter(e => e.id !== id));
  };

  const isEmpty = cart.length === 0 && selectedExtras.length === 0;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-brand-orange font-bold uppercase tracking-wider text-sm hover:text-brand-pink transition-colors">
          ← Volver
        </button>
        <h2 className="text-3xl font-black text-brand-orange text-center flex-1">Tu Selección</h2>
      </div>

      <div className="space-y-4 mb-8">
        {cart.map(item => {
           let thePack = allPacks.find(p => p.id === item.id);
           if (!thePack) {
             if(item.id.startsWith('pf-')) {
               thePack = { id: item.id, name: "Petit Fours: " + item.id.replace('pf-', ''), price: "Consultar", img: "", description: "", pax: "" };
             } else if (item.id.startsWith('torta-')) {
               thePack = { id: item.id, name: "Torta: " + item.id.replace('torta-', ''), price: "Consultar", img: "", description: "", pax: "" };
             }
           }
           if(!thePack) return null;
           
           return (
             <div key={item.id} className="bg-white rounded-3xl p-5 border-2 border-brand-pink/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="font-bold text-brand-orange text-lg text-center sm:text-left">{thePack.name}</span>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <div className="flex items-center gap-3 bg-brand-cream/50 rounded-full p-1 border border-brand-pink/20 shrink-0">
                    <button onClick={() => updateCart(item.id, -1)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-brand-orange hover:bg-brand-pink hover:text-white transition-colors">
                        <Minus size={20} />
                    </button>
                    <span className="font-bold text-xl text-brand-orange w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateCart(item.id, 1)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-brand-orange hover:bg-brand-pink hover:text-white transition-colors shadow-sm">
                      <Plus size={20} />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-brand-orange/40 hover:text-brand-orange transition-colors">
                    <Trash2 size={24} />
                  </button>
                </div>
             </div>
           );
        })}
        {selectedExtras.map(ex => {
           const theExtra = EXTRAS_AVAILABLE.find(e => e.id === ex.id);
           if(!theExtra) return null;
           
           return (
             <div key={ex.id} className="bg-white rounded-3xl p-5 border-2 border-brand-pink/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="font-bold text-brand-orange text-lg text-center sm:text-left">{theExtra.name}</span>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <div className="flex items-center gap-3 bg-brand-cream/50 rounded-full p-1 border border-brand-pink/20 shrink-0">
                    <button onClick={() => updateExtraQuantity(ex.id, -1)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-brand-orange hover:bg-brand-pink hover:text-white transition-colors">
                        <Minus size={20} />
                    </button>
                    <span className="font-bold text-xl text-brand-orange w-6 text-center">{ex.quantity}</span>
                    <button onClick={() => updateExtraQuantity(ex.id, 1)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-brand-orange hover:bg-brand-pink hover:text-white transition-colors shadow-sm">
                      <Plus size={20} />
                    </button>
                  </div>
                  <button onClick={() => removeExtra(ex.id)} className="text-brand-orange/40 hover:text-brand-orange transition-colors">
                    <Trash2 size={24} />
                  </button>
                </div>
             </div>
           );
        })}

        {isEmpty && (
           <div className="text-center text-brand-orange/60 font-bold py-8">
             Tu selección está vacía.
           </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <button onClick={onAddMore} className="w-full bg-white text-brand-pink font-bold uppercase tracking-widest py-4 px-8 rounded-full border-2 border-brand-pink hover:bg-brand-pink hover:text-white transition-colors text-center shadow-sm">
          Añadir más productos
        </button>

        {!isEmpty && (
          <button onClick={onBack} className="w-full bg-brand-pink text-white font-black uppercase tracking-widest py-4 px-8 rounded-full shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-center">
            Continuar al checkout
          </button>
        )}
      </div>

    </div>
  );
}

function FriendlyPopup({
  title,
  message,
  type,
  onClose,
  onConsult,
}: {
  title: string;
  message: string;
  type: 'hora' | 'fecha';
  onClose: () => void;
  onConsult: () => void;
}) {
  const illustration = type === 'hora' ? (
    <svg viewBox="0 0 120 120" width="90" height="90" className="mx-auto mb-4">
      <circle cx="60" cy="60" r="54" fill="#FFE8F5" stroke="#FF99CC" strokeWidth="4"/>
      <circle cx="60" cy="60" r="42" fill="#fff" stroke="#FF99CC" strokeWidth="2"/>
      <line x1="60" y1="30" x2="60" y2="62" stroke="#FF5A00" strokeWidth="5" strokeLinecap="round"/>
      <line x1="60" y1="62" x2="82" y2="74" stroke="#FF99CC" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="60" cy="62" r="4" fill="#FF5A00"/>
      <text x="60" y="108" textAnchor="middle" fontSize="12" fill="#FF99CC" fontWeight="bold">⏰</text>
    </svg>
  ) : (
    <svg viewBox="0 0 120 120" width="90" height="90" className="mx-auto mb-4">
      <circle cx="60" cy="60" r="54" fill="#FFF3E8" stroke="#FF9966" strokeWidth="4"/>
      <rect x="28" y="38" width="64" height="52" rx="8" fill="#fff" stroke="#FF9966" strokeWidth="2"/>
      <rect x="28" y="38" width="64" height="16" rx="8" fill="#FFE0CC"/>
      <line x1="44" y1="30" x2="44" y2="48" stroke="#FF5A00" strokeWidth="4" strokeLinecap="round"/>
      <line x1="76" y1="30" x2="76" y2="48" stroke="#FF5A00" strokeWidth="4" strokeLinecap="round"/>
      <text x="60" y="78" textAnchor="middle" fontSize="20" fill="#FF9966">🍰</text>
    </svg>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-brand-cream rounded-[32px] p-8 max-w-sm w-full shadow-2xl border-4 border-brand-pink text-center relative animate-in zoom-in-95 fade-in duration-200"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-orange/40 hover:text-brand-orange transition-colors">
          <X size={22} />
        </button>
        {illustration}
        <h3 className="font-sans font-black text-2xl text-brand-orange mb-3 leading-tight">{title}</h3>
        <p className="text-brand-orange/75 font-medium mb-7 leading-relaxed text-sm">{message}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onClose}
            className="bg-brand-pink text-white font-bold uppercase tracking-widest py-3 px-6 rounded-full hover:bg-brand-orange transition-colors text-sm shadow-md"
          >
            Seleccionar {type === 'hora' ? 'otro horario' : 'otra fecha'}
          </button>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola! Quiero consultar sobre la hora de envío de mi pedido.')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="text-brand-orange font-bold uppercase tracking-widest py-3 px-6 rounded-full border-2 border-brand-orange/20 hover:bg-brand-orange/10 transition-colors text-sm flex items-center justify-center"
          >
            Consultar
          </a>
        </div>
      </div>
    </div>
  );
}

function CustomQueryForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    contacto: "",
    consulta: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let text = `[CONSULTA LIBRE]\nHola! Me llamo ${formData.nombre} · Contacto: ${formData.contacto}\nConsulta: ${formData.consulta}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const inputClasses = "w-full bg-white/90 px-5 py-3 rounded-[20px] border-2 border-brand-pink/20 focus:border-brand-pink focus:ring-0 outline-none transition-all placeholder:text-brand-orange/40 text-brand-orange text-sm shadow-sm font-medium";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       <input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Tu nombre" className={inputClasses} />
       <input required type="text" name="contacto" value={formData.contacto} onChange={handleChange} placeholder="Teléfono o Instagram (@usuario)" className={inputClasses} />
       <textarea required name="consulta" value={formData.consulta} onChange={handleChange} placeholder="¿Qué tenés en mente? Contanos..." rows={3} className={`${inputClasses} resize-none`} />
       <button type="submit" className="w-full flex items-center justify-center gap-3 bg-[#FF99CC] text-brand-orange font-black uppercase tracking-widest py-4 px-8 rounded-full border-[3px] border-brand-orange shadow-[4px_4px_0_0_rgba(255,90,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0_0_rgba(255,90,0,1)] transition-all mt-6 text-lg">
         <WhatsappIcon size={24} />
         Enviar Consulta
       </button>
    </form>
  );
}
