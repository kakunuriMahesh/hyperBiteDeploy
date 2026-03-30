import { motion } from "framer-motion";
import {
  FaLeaf,
  FaBolt,
  FaFlask,
  FaRunning,
  FaCheckCircle,
  FaBoxOpen
} from "react-icons/fa";
import HyperBiteManifesto from "../components/OurSection";

export default function AboutPage() {
  return (
    <div style={{ paddingTop: '70px' }} className="bg-[#f8f9fb] text-gray-900">

      {/* HERO */}
      <section className="px-6 md:px-20 py-20 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          The End of "Fake Healthy." <br />
          <span className="text-gray-500">
            The Era of Authentic Fuel.
          </span>
        </h1>

        <p className="text-lg text-gray-600 max-w-3xl leading-7">
          At HyperBite, we didn't start with a recipe; we started with a realization:
          the modern health-food industry is broken.
        </p>
      </section>

      {/* INDUSTRY PROBLEM */}
      <section className="px-6 md:px-20 pb-16 max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        <p className="text-gray-600 leading-7">
          We watched as "healthy" brands flooded shelves with products replacing
          white sugar with jaggery or syrups — claiming benefits that don’t exist.
          To the human body, a sugar spike is a sugar spike.
        </p>

        <p className="text-gray-600 leading-7">
          We saw the rush for sales compromising ingredient integrity. We saw
          ancient grains stripped of their value for convenience. So we chose a
          different path.
        </p>
      </section>

      {/* USP */}
      <section className="px-6 md:px-20 py-20 max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-10 rounded-3xl flex flex-col md:flex-row gap-6 items-center">
          <FaBolt className="text-4xl text-green-600" />

          <div>
            <h2 className="text-3xl font-semibold mb-3">
              Pocket-Friendly Bio-Fuel
            </h2>
            <p className="text-gray-600 leading-7">
              Every HyperBite SKU is designed for extreme portability. Whether
              trekking, in a boardroom, at the gym, or in a lecture hall,
              HyperBite fits in your pocket to deliver clean, steady energy
              without the sugar crash.
            </p>
          </div>
        </div>
      </section>
     
      {/* STANDARD */}
      <section className="px-6 md:px-20 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold mb-10">
          The HyperBite Standard
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <FaCheckCircle className="text-green-600 mb-3" />
            <h3 className="font-semibold mb-2">Authenticity</h3>
            <p className="text-gray-600 text-sm">
              Real ingredients, visible and untampered.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <FaBoxOpen className="text-blue-600 mb-3" />
            <h3 className="font-semibold mb-2">Value</h3>
            <p className="text-gray-600 text-sm">
              Maximum nutrient density in every gram.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <FaBolt className="text-yellow-600 mb-3" />
            <h3 className="font-semibold mb-2">Performance</h3>
            <p className="text-gray-600 text-sm">
              Steady, clean energy with zero sugar crashes.
            </p>
          </div>

        </div>
      </section>

      <HyperBiteManifesto/>


      

    </div>
  );
}