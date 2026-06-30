import React from 'react';
import { FaPlus, FaTag, FaStar } from 'react-icons/fa';
import { useCart } from '../store/hooks/useCart';
import { useLanguage } from '../store/hooks/useLanguage';

const PackCard = ({ pack, breakpoint, onClickCustomize, onClickAdd, isCustomized = false, onViewDetails }) => {
  const { packItems } = useCart();
  const { t } = useLanguage();

  const existingPack = packItems.find((p) => p.packId === pack.id);
  const qty = existingPack ? existingPack.quantity : 0;
  const isMobile = breakpoint === 'mobile';
  const discount = pack.offPrice > pack.price ? Math.round(((pack.offPrice - pack.price) / pack.offPrice) * 100) : 0;

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
      style={{boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)'}}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden bg-[#f8f7f4]">
        <div className="aspect-[4/3] flex items-center justify-center p-6 relative">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.03) 100%)'}} />
          {pack.image ? (
            <div className="flex items-center justify-center gap-2 relative z-10">
              <img
                src={pack.image}
                alt={pack.name}
                className="h-34 md:h-44 w-auto object-contain transition-transform duration-700 group-hover:scale-110"
              />
              {pack?.freepack?.image && (
                <>
                  <FaPlus className="text-[#b0b0b0] text-sm md:text-base flex-shrink-0" />
                  <img
                    src={pack.freepack.image}
                    alt={pack.freepack.name}
                    className="h-24 md:h-32 w-auto object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                </>
              )}
            </div>
          ) : (
            <div className="text-5xl opacity-20">📦</div>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {pack.isCustomizable && isCustomized && (
            <span className="px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold bg-[#e8f5e9] text-[#2e7d32] shadow-sm" style={{backdropFilter: 'blur(4px)'}}>
              ✓ Customizing
            </span>
          )}
        </div>
        <div className="z-50 absolute top-3 right-3 flex flex-col gap-2 items-end">
          {discount > 0 && (
            <span className="px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold text-white shadow-sm"
              style={{background: 'linear-gradient(135deg, #e53935, #c62828)'}}
            >
              {discount}% OFF
            </span>
          )}
          {pack.badge && (
            <span className="px-2.5 py-1 rounded-full text-[10px] md:text-xs font-semibold text-white shadow-sm flex items-center gap-1.5"
              style={{background: 'linear-gradient(135deg, #1a1a1a, #444)'}}
            >
              <FaTag className="text-[9px]" />
              {pack.badge}
            </span>
          )}
        </div>

        {/* Quick-add indicator on hover */}
        <div className="absolute inset-x-0 bottom-0 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.04), transparent)'}}
        />
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        <h3 className="font-['Nunito_Sans'] text-base md:text-lg font-semibold text-[#1a1a1a] mb-1.5 leading-tight">
          {pack.name}
        </h3>
        <p className="font-['Inter'] text-xs md:text-sm text-[#8b8b8b] leading-relaxed mb-3 line-clamp-2">
          {pack.description}
        </p>

        {/* Free gift badge */}
        {pack?.freepack?.name && (
          <div className="flex items-center gap-1.5 mb-3 px-2.5 py-1.5 rounded-lg bg-[#fff8e1] text-[#b8860b] text-[10px] md:text-xs font-medium w-fit">
            <FaStar className="text-[10px]" />
            Free {pack.freepack.name}
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-baseline gap-2.5 mb-4">
          <span className="font-['Nunito_Sans'] text-xl md:text-2xl font-bold text-[#1a1a1a]">
            ₹{pack.price}
          </span>
          {pack.offPrice > pack.price && (
            <span className="font-['Inter'] text-xs md:text-sm text-[#b0b0b0] line-through">
              ₹{pack.offPrice}
            </span>
          )}
        </div>

        {/* Footer text */}
        {pack?.detailsContent?.footer && (
          <p className="text-[10px] md:text-xs text-[#a0a0a0] mb-4 leading-relaxed">
            {pack.detailsContent.footer}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2.5">
          <button
            onClick={() => onViewDetails(pack)}
            className="flex-1 h-11 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 border"
            style={{
              borderColor: '#e5e5e5',
              color: '#4a4a4a',
              background: '#fff',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.color = '#1a1a1a' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.color = '#4a4a4a' }}
          >
            Details
          </button>
          <button
            disabled={pack.availableStatus === "Out of Stock"}
            onClick={() => {
              if (pack.isCustomizable) {
                onClickCustomize(pack);
                return;
              }
              onClickAdd(pack);
            }}
            className="flex-1 h-11 rounded-xl text-xs md:text-sm font-semibold tracking-wide transition-all duration-300"
            style={{
              background: pack.availableStatus !== "Out of Stock"
                ? 'linear-gradient(135deg, #1a1a1a, #333)'
                : '#d4d4d4',
              color: '#fff',
              cursor: pack.availableStatus !== "Out of Stock" ? 'pointer' : 'not-allowed',
            }}
            onMouseEnter={(e) => {
              if (pack.availableStatus !== "Out of Stock") {
                e.currentTarget.style.opacity = '0.92';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {pack.availableStatus === "Out of Stock" ? 'Out of Stock'
              : pack.isCustomizable ? 'Customize' : 'Add Pack'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackCard;
