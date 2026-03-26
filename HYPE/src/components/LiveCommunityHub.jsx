import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LiveCommunityHub() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Total Impact",
      subtitle: "Snack Boxes Donated",
      value: "75+",
      desc: "Track how every bite fuels a child’s future.",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      route: "/impact",
    },
    {
      title: "Live Challenge Leaders",
      subtitle: "Pushup Challenge",
      value: "Top Performers",
      desc: "Compete, climb ranks, and dominate the leaderboard.",
      image: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e",
      route: "/challenges",
    },
    {
      title: "Chess Grand Master",
      isActive: true,
      subtitle: "Strategy Challenge",
      value: "Live Matches",
      desc: "Sync your chess ID, compete, and earn rewards.",
      image: "https://images.unsplash.com/photo-1586165368502-1bad197a6461",
      route: "/chess",
    },
    {
      title: "All India Ride",
      subtitle: "Community Chronicles",
      value: "Live Stories",
      desc: "Explore journeys from riders across India.",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      route: "/rides",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-10">

        {/* Heading */}
        <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-10">
          LIVE COMMUNITY HUB
        </h2>

        {/* Scroll Container */}
        <div className="relative">

          {/* X Scroll Wrapper */}
          <div
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-2"
          >
            {cards.map((card, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate(card.route)}
                className="min-w-[85%] sm:min-w-[60%] md:min-w-[40%] lg:min-w-[30%] 
                cursor-pointer snap-start group relative rounded-2xl overflow-hidden 
                border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300"
              >

                {/* Image */}
                <img
                  src={`${card.image}?auto=format&fit=crop&w=800&q=80`}
                  alt={card.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>
{card.isActive && <span className="absolute top-4 right-4 text-xs bg-white text-black px-2 py-1 rounded">
  LIVE
</span>}
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">

                  {/* Top */}
                  <div>
                    <h3 className="text-xl font-bold">{card.title}</h3>
                    <p className="text-sm opacity-80">{card.subtitle}</p>
                  </div>

                  {/* Center */}
                  <div className="text-3xl font-extrabold">
                    {card.value}
                  </div>

                  {/* Bottom */}
                  <div>
                    <p className="text-sm opacity-90 mb-3">{card.desc}</p>
                    <span className="text-sm font-semibold border-b border-white">
                      Explore →
                    </span>
                  </div>

                </div>

              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* Hide Scrollbar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}