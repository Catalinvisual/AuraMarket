"use client";
import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Minus, Plus, ShoppingBag, Truck, ShieldCheck, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useCart } from "@/context/CartContext";
import axios from "axios";
import { products as fallbackProducts } from "@/lib/data";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: {
    id: string;
    name: string;
  };
  images: string[];
  features?: string[];
  rating?: number;
  stock: number;
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const { addToCart } = useCart();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products/${id}`);
        setProduct(response.data);
        if (response.data.images && response.data.images.length > 0) {
            setSelectedImage(response.data.images[0]);
        }
        
        // Fetch related products
        if (response.data.category?.id) {
           const relatedRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products?categoryId=${response.data.category.id}&limit=4`);
           setRelatedProducts(relatedRes.data.products.filter((p: Product) => p.id !== id));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        // Fallback to local data
        const fallbackProduct = fallbackProducts.find(p => p.id === id);
        if (fallbackProduct) {
             const mappedProduct: Product = {
                 id: fallbackProduct.id,
                 name: fallbackProduct.name,
                 description: fallbackProduct.description,
                 price: fallbackProduct.price,
                 category: {
                     id: "cat-fallback",
                     name: fallbackProduct.category
                 },
                 images: [fallbackProduct.image],
                 rating: fallbackProduct.rating,
                 stock: 10,
                 features: ["Premium quality", "Modern design", "Eco-friendly"]
             };
             setProduct(mappedProduct);
             setSelectedImage(fallbackProduct.image);
             
             // Related products fallback
             const related = fallbackProducts
                .filter(p => p.category === fallbackProduct.category && p.id !== id)
                .slice(0, 4)
                .map(p => ({
                     id: p.id,
                     name: p.name,
                     description: p.description,
                     price: p.price,
                     category: { id: "cat-fallback", name: p.category },
                     images: [p.image],
                     stock: 10,
                     rating: p.rating
                }));
             setRelatedProducts(related);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!product) {
    // We can return null here and let the user see a not found message or use notFound() 
    // but notFound() works best in server components or during initial render.
    // For client-side fetch, a simple UI is often better.
    return (
        <div className="min-h-screen flex flex-col justify-center items-center gap-4">
            <h1 className="text-2xl font-bold">Product not found</h1>
            <Link href="/shop" className="text-purple-600 hover:underline">Back to Shop</Link>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-purple-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-purple-600 transition-colors">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-900 relative">
               <img 
                 src={selectedImage ? (selectedImage.startsWith('http') ? selectedImage : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${selectedImage}`) : (product.images && product.images.length > 0 ? (product.images[0].startsWith('http') ? product.images[0] : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${product.images[0]}`) : '/placeholder.svg')}
                 alt={product.name} 
                 className="object-cover w-full h-full"
                 onError={(e) => {
                   (e.target as HTMLImageElement).src = '/placeholder.svg';
                 }}
               />
            </div>
            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, i) => (
                    <div 
                        key={i} 
                        onClick={() => setSelectedImage(img)}
                        className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 ${selectedImage === img ? 'border-purple-600' : 'border-transparent'}`}
                    >
                    <img 
                        src={img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${img}`} 
                        alt="" 
                        className={`object-cover w-full h-full transition-opacity ${selectedImage === img ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`} 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                    />
                    </div>
                ))}
                </div>
            )}
          </motion.div>

          {/* Product Info Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-2">
               <span className="text-sm font-bold text-purple-600 uppercase tracking-wider">{product.category?.name || 'Uncategorized'}</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.floor(product.rating || 5) ? "currentColor" : "none"} className={i < Math.floor(product.rating || 5) ? "" : "text-gray-300 dark:text-gray-700"} />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.rating || 5.0} / 5.0) • 124 reviews</span>
            </div>

            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-8">€{product.price}</p>

            <div className="prose dark:prose-invert max-w-none mb-8">
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                {product.description}
                </p>
            </div>

            {/* Product Features */}
            {product.features && product.features.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Product Highlights</h3>
                    <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-600 flex-shrink-0" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 border-b border-gray-100 dark:border-gray-800 pb-10">
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-full w-fit">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-full transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-r-full transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button 
                onClick={() => {
                    const cartProduct = {
                        ...product,
                        image: product.images && product.images.length > 0 ? (product.images[0].startsWith('http') ? product.images[0] : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${product.images[0]}`) : '',
                        category: product.category?.name || 'Uncategorized',
                        rating: product.rating || 5.0
                    };
                    // @ts-ignore
                    addToCart(cartProduct, quantity);
                }}
                className="flex-1 bg-black dark:bg-white text-white dark:text-black h-12 rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <ShoppingBag size={20} />
                Add to Cart
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                <Truck className="mb-3 text-purple-600" size={24} />
                <span className="font-semibold text-sm">Free Shipping</span>
                <span className="text-xs text-gray-500 mt-1">On orders over $50</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                <ShieldCheck className="mb-3 text-purple-600" size={24} />
                <span className="font-semibold text-sm">2 Year Warranty</span>
                <span className="text-xs text-gray-500 mt-1">Full coverage</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                <RefreshCcw className="mb-3 text-purple-600" size={24} />
                <span className="font-semibold text-sm">30 Days Return</span>
                <span className="text-xs text-gray-500 mt-1">Hassle-free</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
           <div className="mt-24 border-t border-gray-100 dark:border-gray-800 pt-16">
              <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">You might also like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                 {relatedProducts.map((p) => (
                    <Link key={p.id} href={`/shop/${p.id}`} className="group block">
                       <div className="rounded-2xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-900 aspect-square">
                          <img 
                            src={p.images && p.images.length > 0 ? (p.images[0].startsWith('http') ? p.images[0] : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${p.images[0]}`) : '/placeholder.svg'} 
                            alt={p.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                       </div>
                       <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">{p.name}</h3>
                       <p className="text-gray-500">€{p.price}</p>
                    </Link>
                 ))}
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
