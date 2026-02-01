export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  isNew?: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Neo-Holographic Sneakers",
    description: "Experience the future of walking with adaptive holographic materials that change color based on your environment.",
    price: 299.99,
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
    rating: 4.8,
    isNew: true
  },
  {
    id: "2",
    name: "Quantum Noise-Cancelling Headphones",
    description: "Silence the world with quantum-level noise cancellation technology and crystal clear high-fidelity audio.",
    price: 349.50,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
    rating: 4.9,
    isNew: true
  },
  {
    id: "3",
    name: "Smart Bio-Fabric Jacket",
    description: "A jacket that regulates your body temperature and monitors your vitals while looking effortlessly stylish.",
    price: 189.00,
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop",
    rating: 4.7
  },
  {
    id: "4",
    name: "Minimalist Ceramic Watch",
    description: "Timekeeping stripped down to its essence. Crafted from aerospace-grade ceramic for durability and elegance.",
    price: 129.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1976&auto=format&fit=crop",
    rating: 4.6
  },
  {
    id: "5",
    name: "Levitating Plant Pot",
    description: "Add a touch of magic to your home with this magnetic levitating plant pot. Perfect for bonsai and succulents.",
    price: 79.95,
    category: "Home",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=2072&auto=format&fit=crop",
    rating: 4.5
  },
  {
    id: "6",
    name: "AR Smart Glasses",
    description: "Navigate your world with augmented reality overlays. Check messages, maps, and more without lifting a finger.",
    price: 599.00,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=2080&auto=format&fit=crop",
    rating: 4.2
  },
    {
    id: "7",
    name: "Ergonomic Mesh Chair",
    description: "Designed for the modern workspace, providing ultimate support and breathability for long hours.",
    price: 450.00,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=2050&auto=format&fit=crop",
    rating: 4.8
  },
  {
    id: "8",
    name: "Mechanical Keychron Keyboard",
    description: "Tactile feedback meets wireless freedom. The ultimate typing experience for developers and creators.",
    price: 110.00,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b91ddce?q=80&w=2074&auto=format&fit=crop",
    rating: 4.9
  }
];
