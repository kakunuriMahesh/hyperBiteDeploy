import { motion } from "framer-motion";
import {
  FaLeaf,
  FaBolt,
  FaFlask,
  FaRunning,
  FaCheckCircle,
  FaBoxOpen
} from "react-icons/fa";

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

      {/* PHILOSOPHY */}
      <section className="bg-white py-20 px-6 md:px-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-8">
            Our Philosophy
          </h2>

          <p className="text-gray-600 leading-7 mb-5">
            We don’t just manufacture snacks; we engineer superfoods for the modern,
            fast-paced lifestyle.
          </p>

          <p className="text-gray-600 leading-7 mb-5">
            We are a clear and bold brand built on transparency. While others try
            to mask sugar behind labels like "jaggery," we call it out — sugar is sugar.
          </p>

          <p className="text-gray-600 leading-7">
            We are not in a rush for sales. We are in a rush to build authentic value.
            Our products contain zero added sugar and zero jaggery, sweetened only
            through Raw Honey and Dates.
          </p>
        </div>
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

      {/* MANIFESTO */}
      <section className="bg-white py-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-12">
            Our Core Manifesto
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {/* CARD 1 */}
            <motion.div whileHover={{ y: -5 }} className="p-6 rounded-2xl border bg-gray-50">
              <FaLeaf className="text-green-600 text-2xl mb-4" />
              <h3 className="font-semibold text-lg mb-3">
                Zero Compromise on Sweetness
              </h3>
              <p className="text-gray-600 text-sm leading-6">
                No added sugar, syrup, or jaggery. Only Raw Honey and Dates.
                If we can’t make it taste incredible naturally, we don’t make it.
              </p>
            </motion.div>

            {/* CARD 2 */}
            <motion.div whileHover={{ y: -5 }} className="p-6 rounded-2xl border bg-gray-50">
              <FaFlask className="text-blue-600 text-2xl mb-4" />
              <h3 className="font-semibold text-lg mb-3">
                Research-Led, Not Market-Led
              </h3>
              <p className="text-gray-600 text-sm leading-6">
                We are not chasing trends. We are in the lab researching,
                developing, and manufacturing products with real biochemical integrity.
              </p>
            </motion.div>

            {/* CARD 3 */}
            <motion.div whileHover={{ y: -5 }} className="p-6 rounded-2xl border bg-gray-50">
              <FaRunning className="text-orange-500 text-2xl mb-4" />
              <h3 className="font-semibold text-lg mb-3">
                Engineered for the Modern Nomad
              </h3>
              <p className="text-gray-600 text-sm leading-6">
                Designed for fast, mobile lifestyles — from trekking mountains
                to long flights, gym sessions, and lectures. Energy should never
                be a variable.
              </p>
            </motion.div>

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

      {/* PROMISE */}
      <section className="px-6 md:px-20 py-20 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6">
          Our Promise
        </h2>
        <p className="text-gray-600 leading-7">
          HyperBite stands as a solid brand for those who look for real products.
          We don’t chase trends — we set the standard for what modern nutrition
          should be.
        </p>
      </section>

      {/* ===== Mission Block ===== */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-20 border-t border-gray-200 pt-10 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Our Mission
          </h3>

          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed text-lg">
            To fuel the extraordinary in the everyday — powering a community that dreams bigger, moves faster, and gives back harder.
          </p>
        </motion.div>

    </div>
  );
}