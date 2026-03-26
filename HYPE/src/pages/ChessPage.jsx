import { motion } from "framer-motion";
import { FaChess } from "react-icons/fa";

export default function ChessPage() {
  return (
    <div style={{ paddingTop: '120px' }} className="bg-[#f8f9fb] text-gray-900 min-h-screen px-6 md:px-20 py-16">

      {/* HERO */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-5xl font-bold mb-6 flex items-center gap-3">
          <FaChess /> Chess Grandmasters
        </h1>
        <p className="text-gray-400 max-w-2xl">
          Fuel for the brain. Strategy meets energy.
        </p>
      </motion.div>

      {/* CONTENT */}
      <div className="mt-16 grid md:grid-cols-2 gap-12 items-center">
        <img src="https://images.unsplash.com/photo-1523875194681-bedd468c58bf?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="rounded-3xl" />

        <motion.div initial={{ x: 40 }} whileInView={{ x: 0 }}>
          <h2 className="text-3xl font-semibold mb-4">
            Monthly Online Battles
          </h2>
          <p className="text-gray-400 leading-7">
            Participate in our Monthly Online Chess Tournaments. Whether you're a beginner or a Grandmaster, test your wits against the community.
          </p>
          <p className="text-gray-400 mt-4">
            Win premium snack bundles and prove your strategy.
          </p>
        </motion.div>
      </div>
    </div>
  );
}