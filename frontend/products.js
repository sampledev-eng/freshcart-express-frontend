const products = [
  {
    id: 1,
    name: 'Apple',
    brand: 'FarmFresh',
    category: 'Fruits',
    price: 2.5,
    mrp: 3.0,
    eta: '2 hrs',
    variants: [
      { label: '500g', price: 2.5 },
      { label: '1kg', price: 4.5 }
    ],
    popularity: 5,
    stock: 10,
    image: 'https://via.placeholder.com/200?text=Apple',
    description: 'Fresh apples from local farms.'
  },
  {
    id: 2,
    name: 'Banana',
    brand: 'Tropico',
    category: 'Fruits',
    price: 1.2,
    mrp: 1.5,
    eta: '2 hrs',
    variants: [
      { label: '500g', price: 1.2 },
      { label: '1kg', price: 2.2 }
    ],
    popularity: 3,
    stock: 0,
    image: 'https://via.placeholder.com/200?text=Banana',
    description: 'Organic bananas rich in potassium.'
  },
  {
    id: 3,
    name: 'Carrot',
    brand: 'VeggieFarm',
    category: 'Vegetables',
    price: 0.9,
    mrp: 1.1,
    eta: '3 hrs',
    variants: [
      { label: '500g', price: 0.9 },
      { label: '1kg', price: 1.6 }
    ],
    popularity: 4,
    stock: 25,
    image: 'https://via.placeholder.com/200?text=Carrot',
    description: 'Crunchy carrots full of vitamins.'
  },
  {
    id: 4,
    name: 'Milk',
    brand: 'DairyBest',
    category: 'Dairy',
    price: 3.0,
    mrp: 3.5,
    eta: '1 hr',
    variants: [
      { label: '1L', price: 3.0 },
      { label: '2L', price: 5.5 }
    ],
    popularity: 5,
    stock: 5,
    image: 'https://via.placeholder.com/200?text=Milk',
    description: 'Dairy milk with full cream.'
  }
];
