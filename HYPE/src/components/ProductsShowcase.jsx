import { motion } from "framer-motion";

const products = [
  {
    packname:"Seed Boost",
    selectedpoint: "The Micronutrient Powerhouse",
    desc: "A savory, crunchy blend of Sunflower, Pumpkin, and Watermelon seeds, lightly roasted in premium ghee with a hint of cinnamon and secret spices.",
    benefit: "5g Clean Plant Protein",
    why: "Rich in Magnesium and Zinc for heart health and immunity. Cinnamon supports metabolism naturally.",
    img: "/assets/seed-boost.png"
  },
  {
    packname:"Cashew Charge",
    selectedpoint: "The Gourmet Junk-Food Killer Fresh,",
    desc: " high-quality cashews roasted in allowable ghee and seasoned with a bold Cinnamon profile.",
    benefit: "A direct, healthy replacement for high-cholesterol, oil-soaked chips.",
    why: "Provides healthy monounsaturated fats that keep you satiated longer, killing hot cravings instantly while supporting brain health",
    img: "/assets/cashew-charge.png"
  },
  {
    packname:"Millet Matrix",
    selectedpoint: "Ancient Grains for Modern Endurance An authentic experience of ancient wisdom,",
    desc: " combining Raagi, Sajja, Korra, and Jonnalu. Sweetened only with Raw Honey and Dates.",
    benefit: "An exceptional source of complex dietary fiber.",
    why: "The slow-release carbohydrates from these four millets ensure you stay full and focused for hours, maintaining gut health and steady glucose levels.",
    img: "/assets/Millet-matrix.png"
  },
  {
    packname:"Oats Octane",
    selectedpoint: "The Sustained Energy Engine",
    desc: " A high-performance mix of Rolled Oats, Sunflower & Pumpkin seeds, Roasted Peanuts and Raw Honey.",
    benefit: "Delivers Clean Energy with a zero-sugar-spike guarantee.",
    why: "The combination of Beta-Glucan (from oats) and healthy fats (from peanuts/seeds) creates a time-release energy effect, making it the perfect partner for long journeys or sports.",
    img: "/assets/Oats-Octane.png"
  },
  {
    packname:"Power Chunk",
    selectedpoint: "The High-Protein Recovery Bite",
    desc: " A potent blend of Dates, Nuts, Hemp Protein powder and Dark Chocolate, finished with a refreshing Orange zest.",
    benefit: "A complete protein source that stops junk-food hunting in its tracks.",
    why: "Hemp protein contains all nine essential amino acids. Combined with the antioxidants in dark chocolate and the natural energy of dates, it’s the ultimate post-workout or high-intensity recovery snack.",
    img: "/assets/closeCover.png"
  },
  // add 4 more
];

export default function ProductsStorySection() {
  return (
    <div className="bg-[#f8f9fb] py-20 px-6 md:px-16 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="max-w-3xl mb-20">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Designed for Everyday Power
        </h2>
        <p className="text-gray-600">
          Clean ingredients. Real benefits. No compromises.
        </p>
      </div>

      {/* PRODUCTS */}
      <div className="flex flex-col gap-24">

        {products.map((item, index) => {
          const isReverse = index % 2 !== 0;

          return (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center justify-between gap-5 ${
                isReverse ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* IMAGE */}
              <div className={`${isReverse ? "w-full md:w-1/2 flex md:flex-row flex-col justify-center" : "w-full md:w-1/2 flex flex-col  justify-start"}`}>
                {!isReverse ? <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{item.packname}</h1> : <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:hidden">{item.packname}</h1>}
                <div
                  className="w-full md:w-1/2 flex justify-center"
                >
                  <div className="w-[260px] md:w-[320px] aspect-[3/4] hover:scale-105 transition duration-500 overflow-hidden shadow-xl">
                    <img
                      src={item.img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* CONTENT */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="w-full md:w-1/2"
              >
                {isReverse ? <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:block hidden">{item.packname}</h1> : null}
                <p className="text-gray-600 leading-7 mb-5">
                  <span className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                  {item.selectedpoint + " "}
                  </span>
                  {item.desc}
                </p>

                

                {/* BENEFIT */}
                <div className="inline-block bg-green-100 text-green-700 text-sm px-4 py-1 rounded-full mb-6">
                  {item.benefit}
                </div>

                {/* WHY */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
                    Why it works
                  </p>
                  <p className="text-gray-700 text-sm leading-6">
                    {item.why}
                  </p>
                </div>
              </motion.div>
            </div>
          );
        })}

      </div>
    </div>
  );
}