export interface DefaultItem {
  name: string
  icon: string
  weightKg?: number
  category: string
}

export const defaultItems: DefaultItem[] = [
  // Camping-Möbel
  { name: 'Campingstuhl', icon: 'Armchair', category: 'Möbel', weightKg: 2.5 },
  { name: 'Campingtisch', icon: 'Table', category: 'Möbel', weightKg: 4.0 },
  { name: 'Sonnenliege', icon: 'Bed', category: 'Möbel', weightKg: 3.5 },

  // Küche
  { name: 'Teller', icon: 'Circle', category: 'Küche', weightKg: 0.3 },
  { name: 'Tasse', icon: 'Coffee', category: 'Küche', weightKg: 0.2 },
  { name: 'Besteck', icon: 'Utensils', category: 'Küche', weightKg: 0.5 },
  { name: 'Topf', icon: 'CookingPot', category: 'Küche', weightKg: 1.0 },
  { name: 'Pfanne', icon: 'Circle', category: 'Küche', weightKg: 0.8 },
  { name: 'Wasserkocher', icon: 'Coffee', category: 'Küche', weightKg: 0.9 },

  // Elektronik
  { name: 'Ladekabel', icon: 'Cable', category: 'Elektronik', weightKg: 0.2 },
  { name: 'Powerbank', icon: 'Battery', category: 'Elektronik', weightKg: 0.3 },
  { name: 'Ladegerät', icon: 'Plug', category: 'Elektronik', weightKg: 0.2 },
  { name: 'Campinglampe', icon: 'Lightbulb', category: 'Elektronik', weightKg: 0.4 },

  // Kleidung
  { name: 'T-Shirts', icon: 'Shirt', category: 'Kleidung', weightKg: 0.3 },
  { name: 'Hosen', icon: 'Shirt', category: 'Kleidung', weightKg: 0.5 },
  { name: 'Jacke', icon: 'Shirt', category: 'Kleidung', weightKg: 0.8 },
  { name: 'Schuhe', icon: 'Footprints', category: 'Kleidung', weightKg: 0.7 },

  // Bett / Bad
  { name: 'Bettwäsche', icon: 'Bed', category: 'Bett/Bad', weightKg: 1.2 },
  { name: 'Handtücher', icon: 'Bath', category: 'Bett/Bad', weightKg: 0.6 },
  { name: 'Duschzeug', icon: 'Droplets', category: 'Bett/Bad', weightKg: 0.5 },

  // Werkzeug
  { name: 'Werkzeugkasten', icon: 'Wrench', category: 'Werkzeug', weightKg: 3.0 },
  { name: 'Ersatzteile', icon: 'Cog', category: 'Werkzeug', weightKg: 1.0 },

  // Outdoor
  { name: 'Grill', icon: 'Flame', category: 'Outdoor', weightKg: 2.5 },
  { name: 'Markise', icon: 'Tent', category: 'Outdoor', weightKg: 4.0 },
  { name: 'Fahrrad', icon: 'Bike', category: 'Outdoor', weightKg: 15.0 },

  // Hygiene / Medizin
  { name: 'Erste-Hilfe-Kasten', icon: 'BriefcaseMedical', category: 'Hygiene', weightKg: 0.5 },
  { name: 'Medikamente', icon: 'Pill', category: 'Hygiene', weightKg: 0.2 },
  { name: 'Zahnbürste/Pasta', icon: 'Smile', category: 'Hygiene', weightKg: 0.1 },

  // Lebensmittel
  { name: 'Wasserflaschen', icon: 'CupSoda', category: 'Lebensmittel', weightKg: 1.0 },
  { name: 'Konserven', icon: 'Bean', category: 'Lebensmittel', weightKg: 0.5 },
  { name: 'Snacks', icon: 'Cookie', category: 'Lebensmittel', weightKg: 0.3 },
]

export const categories = Array.from(new Set(defaultItems.map((item) => item.category)))
