import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PackCard from "../components/PackCard";
import { fetchProductsFromAPI } from "../config/productDetails";
import { fetchPacksFromAPI } from "../config/packConfig";
import { useCart } from "../store/hooks/useCart";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PincodeModal from "../components/PincodeModal";
import PackDetailsModal from "../components/PackDetailsModal";
import Spinner from "../components/Spinner";

const Products = () => {
  const navigate = useNavigate();
  const { addToCart, addPackToCart, packItems, pincode, setPincode, inProgressPacks } = useCart();
  const [breakpoint, setBreakpoint] = useState('desktop');
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const isMobile = breakpoint === 'mobile';

  useEffect(() => {
    const updateBreakpoint = () => {
      const vw = window.innerWidth;
      if (vw < 768) setBreakpoint('mobile');
      else if (vw < 1024) setBreakpoint('tablet');
      else setBreakpoint('desktop');
    };
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const [products, setProducts] = useState([]);
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchProductsFromAPI().then((merged) => {
        const arr = Array.from(new Set(Object.values(merged)));
        arr.sort((a, b) => {
          const aOut = a.stock === 'Out of Stock' || a.availableStatus === 'Out of Stock' ? 1 : 0;
          const bOut = b.stock === 'Out of Stock' || b.availableStatus === 'Out of Stock' ? 1 : 0;
          return aOut - bOut;
        });
        setProducts(arr);
      }),
      fetchPacksFromAPI().then((data) => {
        const arr = [...data];
        arr.sort((a, b) => {
          const aOut = a.availableStatus === 'Out of Stock' ? 1 : 0;
          const bOut = b.availableStatus === 'Out of Stock' ? 1 : 0;
          return aOut - bOut;
        });
        setPacks(arr);
      }),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleAddDefaultPack = (pack) => {
    const productNameMap = {};
    products.forEach((p) => { productNameMap[p.id] = p.name; });
    const hardcodedFallback = [
      { id: 'cashewCharge', quantity: 2 },
      { id: 'seedBoost', quantity: 2 },
      { id: 'powerChunk', quantity: 2 },
      { id: 'milletMatrix', quantity: 2 },
      { id: 'oatsOctane', quantity: 2 },
    ];
    const raw = (pack.defaultProducts?.length ? pack.defaultProducts : hardcodedFallback);
    const defaultItems = raw.map((item) => ({
      ...item,
      name: item.name || productNameMap[item.id] || item.id,
    }));
    addPackToCart({
      packId: pack.id,
      packName: pack.name,
      packPrice: pack.price,
      packOffPrice: pack.offPrice,
      items: defaultItems,
      total: pack.price,
    });
    toast.success(`${pack.name} added to cart!`);
  };

  const handlePincodeConfirm = (confirmedPincode) => {
    setPincode(confirmedPincode);
    setIsPincodeModalOpen(false);
    toast.success("Pincode set successfully!");
  };

  const handleCustomizePack = (pack) => {
    navigate(`/customize-pack/${pack.id}`, { state: { pack } });
  };

  const handleViewDetails = (pack) => {
    setSelectedPack(pack);
    setIsModalOpen(true);
  };

  const containerWidth = isMobile ? '100%' : breakpoint === 'tablet' ? '720px' : '1200px';
  const sectionGap = isMobile ? '48px' : '72px';

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'packs', label: 'Combo Packs' },
    { key: 'products', label: 'Products' },
  ];

  const filteredPacks = activeTab === 'products' ? [] : packs;
  const filteredProducts = activeTab === 'packs' ? [] : products;

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
          <Spinner text="Loading products..." />
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <div className="relative pt-[70px] overflow-hidden" style={{background: 'linear-gradient(165deg, #faf9f6 0%, #f0ede6 50%, #e8e3d8 100%)'}}>
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'radial-gradient(circle at 25% 50%, #000 1px, transparent 1px), radial-gradient(circle at 75% 50%, #000 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />
            <div className="relative mx-auto px-4 md:px-8 py-12 md:py-20" style={{ maxWidth: containerWidth }}>
              <div className="text-center max-w-2xl mx-auto">
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4" style={{background: 'linear-gradient(135deg, #1a1a1a, #333)', color: '#d4d4d4'}}>
                  Premium Collection
                </span>
                <h1 className="font-['Nunito_Sans'] text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1a1a1a] leading-tight mb-4 tracking-tight">
                  Naturally Good
                </h1>
                <p className="font-['Inter'] text-sm md:text-base text-[#6b6b6b] leading-relaxed max-w-lg mx-auto">
                  Handpicked nuts, seeds, and dried fruits — crafted for a healthier you
                </p>
              </div>
            </div>
            <div className="h-8 md:h-12" style={{background: 'linear-gradient(180deg, transparent, #faf9f6)'}} />
          </div>

          {/* Category Tabs */}
          <div className="mx-auto px-4 md:px-8 -mt-4 relative z-10" style={{ maxWidth: containerWidth }}>
            <div className="flex justify-center gap-2 md:gap-3">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
                  style={{
                    background: activeTab === tab.key ? '#1a1a1a' : '#fff',
                    color: activeTab === tab.key ? '#fff' : '#6b6b6b',
                    boxShadow: activeTab === tab.key ? '0 4px 14px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.06)',
                    border: activeTab === tab.key ? 'none' : '1px solid #e5e5e5',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="mx-auto px-4 md:px-8 py-8 md:py-12" style={{ maxWidth: containerWidth }}>
            {/* Combo Packs */}
            {filteredPacks.length > 0 && (
              <div className="mb-12 md:mb-16">
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4d4d4] to-transparent" />
                  <h2 className="font-['Nunito_Sans'] text-xl md:text-2xl font-bold text-[#1a1a1a] whitespace-nowrap">
                    Combo Packs
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4d4d4] to-transparent" />
                </div>
                <div className="grid gap-5 md:gap-6 lg:gap-8"
                  style={{
                    gridTemplateColumns: isMobile ? '1fr' : breakpoint === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                  }}
                >
                  {filteredPacks.map((pack) => (
                    <PackCard
                      key={pack.id}
                      pack={pack}
                      breakpoint={breakpoint}
                      onClickCustomize={handleCustomizePack}
                      onClickAdd={handleAddDefaultPack}
                      isCustomized={inProgressPacks.some(p => p.packId === pack.id)}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Individual Products */}
            {filteredProducts.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4d4d4] to-transparent" />
                  <h2 className="font-['Nunito_Sans'] text-xl md:text-2xl font-bold text-[#1a1a1a] whitespace-nowrap">
                    All Products
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4d4d4] to-transparent" />
                </div>
                <div className="grid gap-5 md:gap-6 lg:gap-8"
                  style={{
                    gridTemplateColumns: isMobile ? '1fr' : breakpoint === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                  }}
                >
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/product/${product.slug || product.id}`)}
                      className="group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-1"
                      style={{boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)'}}
                    >
                      {/* Image Container */}
                      <div className="relative overflow-hidden aspect-[4/3] bg-[#f8f7f4] flex items-center justify-center p-6">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.03) 100%)'}} />
                        <img
                          src={product.packImg}
                          alt={product.name}
                          className="w-3/5 h-auto object-contain transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-5 md:p-6">
                        <h3 className="font-['Nunito_Sans'] text-base md:text-lg font-semibold text-[#1a1a1a] mb-2 leading-tight">
                          {product.name}
                        </h3>
                        <p className="font-['Inter'] text-xs md:text-sm text-[#8b8b8b] leading-relaxed mb-4 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Price */}
                        <div className="flex items-center gap-2.5 mb-4">
                          <span className="font-['Nunito_Sans'] text-lg md:text-xl font-bold text-[#1a1a1a]">
                            {product.price}
                          </span>
                          {product.compareAtPrice && (
                            <span className="font-['Inter'] text-xs md:text-sm text-[#b0b0b0] line-through">
                              {product.compareAtPrice}
                            </span>
                          )}
                        </div>

                        <button
                          className="w-full py-2.5 md:py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300"
                          style={{
                            background: 'linear-gradient(135deg, #1a1a1a, #333)',
                            color: '#fff',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.92'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredPacks.length === 0 && filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="font-['Inter'] text-[#8b8b8b]">No products found</p>
              </div>
            )}
          </div>

          {selectedPack && (
            <PackDetailsModal
              pack={selectedPack}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          )}
          <PincodeModal
            isOpen={isPincodeModalOpen}
            onClose={() => setIsPincodeModalOpen(false)}
            onConfirm={handlePincodeConfirm}
          />
        </>
      )}
    </div>
  );
};

export default Products;
