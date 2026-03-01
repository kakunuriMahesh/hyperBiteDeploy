// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import PackCard from "../components/PackCard";
// import { productDetails } from "../config/productDetails";
// import { getAllPacks } from "../config/packConfig";
// import { useCart } from "../context/CartContext";
// import { toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
// import PincodeModal from "../components/PincodeModal";

// const Products = () => {
//   const navigate = useNavigate();
//   const { addToCart, addPackToCart, packItems, pincode } = useCart();
//   const [breakpoint, setBreakpoint] = useState('desktop');

//   useEffect(() => {
//     const updateBreakpoint = () => {
//       const viewportWidth = window.innerWidth;
//       if (viewportWidth < 768) {
//         setBreakpoint('mobile');
//       } else if (viewportWidth < 1024) {
//         setBreakpoint('tablet');
//       } else {
//         setBreakpoint('desktop');
//       }
//     };

//     updateBreakpoint();
//     window.addEventListener('resize', updateBreakpoint);
//     return () => window.removeEventListener('resize', updateBreakpoint);
//   }, []);

//   // Check which packs have been customized
//   useEffect(() => {
//     // No longer needed - packs no longer show customization status
//   }, [packItems]);

//   const products = Object.values(productDetails);
//   const packs = getAllPacks();

//   const handleAddDefaultPack = (pack) => {
//     // For pack250, create default items
//     alert(pincode);
//     if(!pincode){
//       // toast.error("Please set a valid pincode to add items to cart.");
//       <PincodeModal isOpen={true} />;
//       return;
//     }
//     const defaultItems = [
//       { id: 'nuts', quantity: 0.5 },
//       { id: 'dates', quantity: 0.3 },
//       { id: 'seeds', quantity: 0.2 }
//     ];

//     addPackToCart({
//       packId: pack.id,
//       packName: pack.name,
//       packPrice: pack.price,
//       packOffPrice: pack.offPrice,
//       items: defaultItems,
//       total: pack.price,
//     });

//     toast.success(`${pack.name} added to cart!`);
//   };

//   const handleCustomizePack = (pack) => {
//     navigate(`/customize-pack/${pack.id}`);
//   };

//   return (
//     <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingTop: '70px' }}>
//       <div
//         style={{
//           maxWidth: breakpoint === 'desktop' ? '1200px' : '100%',
//           margin: '0 auto',
//           padding: breakpoint === 'mobile' ? '20px' : '40px',
//         }}
//       >
//         {/* Header */}
//         <div style={{ textAlign: 'center', marginBottom: breakpoint === 'mobile' ? '40px' : '60px' }}>
//           <h1
//             style={{
//               fontFamily: "Nunito Sans",
//               fontSize: breakpoint === 'mobile' ? '28px' : breakpoint === 'tablet' ? '36px' : '44px',
//               marginBottom: '12px',
//               color: '#111',
//               fontWeight: 700,
//               letterSpacing: '-0.4px',
//             }}
//           >
//             Our Products
//           </h1>
//           <p
//             style={{
//               fontFamily: "'Inter', sans-serif",
//               fontSize: breakpoint === 'mobile' ? '14px' : '16px',
//               color: '#666',
//               maxWidth: '640px',
//               margin: '0 auto',
//               lineHeight: 1.6,
//             }}
//           >
//             Discover our premium collection of natural products
//           </p>
//         </div>

//         {/* Combo Packs Section */}
//         <div style={{ marginBottom: breakpoint === 'mobile' ? '40px' : '60px' }}>
//           <h2
//             style={{
//               fontFamily: "Nunito Sans",
//               fontSize: breakpoint === 'mobile' ? '22px' : '28px',
//               marginBottom: '30px',
//               color: '#111',
//               fontWeight: 700,
//               textAlign: 'center',
//             }}
//           >
//             🎁 Combo Packs
//           </h2>
//           <div
//             style={{
//               display: 'grid',
//               gridTemplateColumns: breakpoint === 'mobile' ? '1fr' : breakpoint === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
//               gap: breakpoint === 'mobile' ? '24px' : '32px',
//             }}
//           >
//             {packs.map((pack) => (
//               <PackCard
//                 key={pack.id}
//                 pack={pack}
//                 breakpoint={breakpoint}
//                 onClickCustomize={handleCustomizePack}
//                 onClickAdd={handleAddDefaultPack}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Divider */}
//         <div
//           style={{
//             height: '1px',
//             backgroundColor: '#eee',
//             margin: breakpoint === 'mobile' ? '40px 0' : '60px 0',
//           }}
//         />

//         {/* Individual Products Section */}
//         <div>
//           <h2
//             style={{
//               fontFamily: "Nunito Sans",
//               fontSize: breakpoint === 'mobile' ? '22px' : '28px',
//               marginBottom: '30px',
//               color: '#111',
//               fontWeight: 700,
//               textAlign: 'center',
//             }}
//           >
//             All Products
//           </h2>
//           <div
//             style={{
//               display: 'grid',
//               gridTemplateColumns: breakpoint === 'mobile' ? '1fr' : breakpoint === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
//               gap: breakpoint === 'mobile' ? '24px' : '32px',
//             }}
//           >
//             {products.map((product) => (
//               <div
//                 key={product.id}
//                 onClick={() => navigate(`/product/${product.id}`)}
//                 style={{
//                   backgroundColor: '#f9f9f9',
//                   borderRadius: '12px',
//                   padding: breakpoint === 'mobile' ? '20px' : '24px',
//                   border: '1px solid #eee',
//                   cursor: 'pointer',
//                   transition: 'all 0.3s ease',
//                   textAlign: 'center',
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = 'translateY(-4px)';
//                   e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = 'translateY(0)';
//                   e.currentTarget.style.boxShadow = 'none';
//                 }}
//               >
//                 <div
//                   style={{
//                     marginBottom: '16px',
//                     display: 'flex',
//                     justifyContent: 'center',
//                   }}
//                 >
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     style={{
//                       width: breakpoint === 'mobile' ? '120px' : '150px',
//                       height: 'auto',
//                       objectFit: 'contain',
//                     }}
//                   />
//                 </div>
//                 <h2
//                   style={{
//                     fontFamily: "Nunito Sans",
//                     fontSize: breakpoint === 'mobile' ? '18px' : '20px',
//                     marginBottom: '8px',
//                     color: '#111',
//                     fontWeight: 600,
//                   }}
//                 >
//                   {product.name}
//                 </h2>
//                 <p
//                   style={{
//                     fontFamily: "'Inter', sans-serif",
//                     fontSize: breakpoint === 'mobile' ? '14px' : '16px',
//                     lineHeight: '1.6',
//                     color: '#666',
//                     marginBottom: '16px',
//                   }}
//                 >
//                   {product.description}
//                 </p>
//                 <div
//                   style={{
//                     fontFamily: "Nunito Sans",
//                     fontSize: breakpoint === 'mobile' ? '18px' : '20px',
//                     color: '#111',
//                     marginBottom: '12px',
//                     fontWeight: 700,
//                   }}
//                 >
//                   {product.price}
//                 </div>
//                 <button
//                   style={{
//                     width: '100%',
//                     padding: breakpoint === 'mobile' ? '12px' : '14px',
//                     fontFamily: "'Inter', sans-serif",
//                     fontSize: breakpoint === 'mobile' ? '16px' : '16px',
//                     fontWeight: 600,
//                     textTransform: 'uppercase',
//                     letterSpacing: '0.6px',
//                     backgroundColor: '#000',
//                     color: '#fff',
//                     border: 'none',
//                     borderRadius: '8px',
//                     cursor: 'pointer',
//                     transition: 'all 0.3s ease',
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.backgroundColor = '#333';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.backgroundColor = '#000';
//                   }}
//                 >
//                   View Details
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Products;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PackCard from "../components/PackCard";
import { productDetails } from "../config/productDetails";
import { getAllPacks } from "../config/packConfig";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PincodeModal from "../components/PincodeModal";

const Products = () => {
  const navigate = useNavigate();
  const { addToCart, addPackToCart, packItems, pincode, setPincode, inProgressPacks } = useCart();
  const [breakpoint, setBreakpoint] = useState('desktop');
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);

  useEffect(() => {
    const updateBreakpoint = () => {
      const viewportWidth = window.innerWidth;
      if (viewportWidth < 768) setBreakpoint('mobile');
      else if (viewportWidth < 1024) setBreakpoint('tablet');
      else setBreakpoint('desktop');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const products = Object.values(productDetails);
  const packs = getAllPacks();

  const handleAddDefaultPack = (pack) => {
    // If no pincode is set → show modal first
    if (!pincode) {
      setIsPincodeModalOpen(true);
      return;
    }

    // Pincode already exists → proceed directly
    const defaultItems = [
      { id: 'nuts', quantity: 0.5 },
      { id: 'dates', quantity: 0.3 },
      { id: 'seeds', quantity: 0.2 }
    ];

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

  // Called when user confirms pincode in modal
  const handlePincodeConfirm = (confirmedPincode) => {
    setPincode(confirmedPincode); // Save to cart context
    setIsPincodeModalOpen(false);
    toast.success("Pincode set successfully!");

    // You can optionally re-trigger add-to-cart here if needed
    // But for now, user can click "Add" again after setting pincode
  };

  const handleCustomizePack = (pack) => {
    // Customize doesn't require pincode check (only add to cart does)
    if (!pincode) {
      setIsPincodeModalOpen(true);
      return;
    }
    navigate(`/customize-pack/${pack.id}`);
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingTop: '70px' }}>
      <div
        style={{
          maxWidth: breakpoint === 'desktop' ? '1200px' : '100%',
          margin: '0 auto',
          padding: breakpoint === 'mobile' ? '20px' : '40px',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: breakpoint === 'mobile' ? '40px' : '60px' }}>
          <h1
            style={{
              fontFamily: "Nunito Sans",
              fontSize: breakpoint === 'mobile' ? '28px' : breakpoint === 'tablet' ? '36px' : '44px',
              marginBottom: '12px',
              color: '#111',
              fontWeight: 700,
              letterSpacing: '-0.4px',
            }}
          >
            Our Products
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: breakpoint === 'mobile' ? '14px' : '16px',
              color: '#666',
              maxWidth: '640px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Discover our premium collection of natural products
          </p>
        </div>

        {/* Combo Packs Section */}
        <div style={{ marginBottom: breakpoint === 'mobile' ? '40px' : '60px' }}>
          <h2
            style={{
              fontFamily: "Nunito Sans",
              fontSize: breakpoint === 'mobile' ? '22px' : '28px',
              marginBottom: '30px',
              color: '#111',
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            🎁 Combo Packs
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: breakpoint === 'mobile' ? '1fr' : breakpoint === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              gap: breakpoint === 'mobile' ? '24px' : '32px',
            }}
          >
            {packs.map((pack) => (
              <PackCard
                key={pack.id}
                pack={pack}
                breakpoint={breakpoint}
                onClickCustomize={handleCustomizePack}
                onClickAdd={handleAddDefaultPack}
                isCustomized={inProgressPacks.some(p => p.packId === pack.id)}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            backgroundColor: '#eee',
            margin: breakpoint === 'mobile' ? '40px 0' : '60px 0',
          }}
        />

        {/* Individual Products Section */}
        <div>
          <h2
            style={{
              fontFamily: "Nunito Sans",
              fontSize: breakpoint === 'mobile' ? '22px' : '28px',
              marginBottom: '30px',
              color: '#111',
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            All Products
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: breakpoint === 'mobile' ? '1fr' : breakpoint === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              gap: breakpoint === 'mobile' ? '24px' : '32px',
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                style={{
                  backgroundColor: '#f9f9f9',
                  borderRadius: '12px',
                  padding: breakpoint === 'mobile' ? '20px' : '24px',
                  border: '1px solid #eee',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={product.packImg}
                    alt={product.name}
                    style={{
                      width: breakpoint === 'mobile' ? '120px' : '150px',
                      height: 'auto',
                      objectFit: 'contain',
                    }}
                  />
                </div>
                <h2
                  style={{
                    fontFamily: "Nunito Sans",
                    fontSize: breakpoint === 'mobile' ? '18px' : '20px',
                    marginBottom: '8px',
                    color: '#111',
                    fontWeight: 600,
                  }}
                >
                  {product.name}
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: breakpoint === 'mobile' ? '14px' : '16px',
                    lineHeight: '1.6',
                    color: '#666',
                    marginBottom: '16px',
                  }}
                >
                  {product.description}
                </p>
                <div
                  style={{
                    fontFamily: "Nunito Sans",
                    fontSize: breakpoint === 'mobile' ? '18px' : '20px',
                    color: '#111',
                    marginBottom: '12px',
                    fontWeight: 700,
                  }}
                >
                  {product.price}
                </div>
                <button
                  style={{
                    width: '100%',
                    padding: breakpoint === 'mobile' ? '12px' : '14px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: breakpoint === 'mobile' ? '16px' : '16px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    backgroundColor: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#333';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#000';
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pincode Modal - Controlled by state */}
      <PincodeModal
        isOpen={isPincodeModalOpen}
        onClose={() => setIsPincodeModalOpen(false)}
        onConfirm={handlePincodeConfirm}
      />
    </div>
  );
};

export default Products;

