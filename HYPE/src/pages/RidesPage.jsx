import { motion } from "framer-motion";
import { FaMotorcycle } from "react-icons/fa";

export default function RidesPage() {
  return (
    <div style={{ paddingTop: '120px' }} className="bg-[#f8f9fb] text-gray-900 min-h-screen px-6 md:px-20 py-16">

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-5xl font-bold mb-6 flex items-center gap-3">
          <FaMotorcycle /> All India Ride
        </h1>

        <p className="text-gray-400 max-w-2xl">
          Calling all explorers, bikers, and travelers.
        </p>
      </motion.div>

      <div className="mt-16 grid md:grid-cols-2 gap-12 items-center">
        <img src="https://images.unsplash.com/photo-1758090524297-028e50b4c40f?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="rounded-3xl" />

        <motion.div initial={{ x: 40 }} whileInView={{ x: 0 }}>
          <h2 className="text-3xl font-semibold mb-4">
            The Ultimate Journey
          </h2>
          <p className="text-gray-400 leading-7">
            Tag us at iconic landmarks across the country with your HyperBite stash.
          </p>
          <p className="text-gray-400 mt-4">
            The most epic journey wins a fully sponsored adventure gear kit.
          </p>
        </motion.div>
      </div>
    </div>
  );
}