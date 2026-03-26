import { motion } from "framer-motion";
import { FaHeart, FaUsers } from "react-icons/fa";

export default function ImpactPage() {
  return (
    <div style={{ paddingTop: '120px' }} className="bg-[#f8f9fb] text-gray-900 min-h-screen px-6 md:px-20 py-16">

      {/* HERO */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Fueling More Than Hunger
        </h1>
        <p className="text-gray-400 text-lg">
          Every bite you take powers a bigger mission — building a community of explorers, thinkers, and achievers.
        </p>
      </motion.div>

      {/* STORY SECTION */}
      <div className="grid md:grid-cols-2 gap-12 mt-20 items-center">
        <motion.img
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          className="rounded-3xl shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
        />

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-3xl font-semibold mb-4 flex items-center gap-3">
            <FaUsers /> Our Community
          </h2>
          <p className="text-gray-400 leading-7">
            From daily walkers to elite athletes, HyperBite is building a tribe that thrives on movement, growth, and shared energy.
          </p>
        </motion.div>
      </div>

      {/* VALUES */}
      <div className="grid md:grid-cols-3 gap-8 mt-20">
        {["Energy", "Adventure", "Connection"].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 p-6 rounded-2xl backdrop-blur-lg"
          >
            <FaHeart className="text-pink-500 text-2xl mb-4" />
            <h3 className="text-xl font-semibold">{item}</h3>
            <p className="text-gray-400 mt-2 text-sm">
              We believe in powering real-life experiences beyond just food.
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}