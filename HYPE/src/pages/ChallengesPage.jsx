import { motion } from "framer-motion";

const challenges = [
  {
    title: "Weekly Distance Goals",
    desc: "Track your steps and dominate the leaderboard.",
    img: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e"
  },
  {
    title: "Monthly Lucky Draw",
    desc: "Every purchase brings you closer to big rewards.",
    img: "https://images.unsplash.com/photo-1599826452316-c682f75d39e7?q=80&w=1475&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    title: "Gift Hampers",
    desc: "Win exclusive HyperBite bundles.",
    img: "https://plus.unsplash.com/premium_photo-1661398229744-e38032aa4e05?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
];

export default function ChallengesPage() {
  return (
    <div style={{ paddingTop: '120px' }} className="bg-[#f8f9fb] text-gray-900 min-h-screen px-6 md:px-20 py-16">

      <h1 className="text-5xl font-bold mb-12">Challenges</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {challenges.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="rounded-3xl overflow-hidden bg-white/5"
          >
            <img src={item.img} className="h-56 w-full object-cover" />
            <div className="p-6">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-gray-400 mt-2">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}