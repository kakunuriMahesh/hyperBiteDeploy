import { motion } from "framer-motion";
import { FaBolt, FaUsers, FaHeart, FaSyncAlt } from "react-icons/fa";

const OurStorySection = () => {
  const pillars = [
    {
      icon: <FaBolt />,
      title: "Fueling Potential",
      desc: "We don't just provide nutrition; we provide energy for your Hyper-Life — physical, mental, and adventurous.",
    },
    {
      icon: <FaUsers />,
      title: "Radical Community",
      desc: "From ride challenges to fitness battles, we grow stronger by pushing each other forward.",
    },
    {
      icon: <FaHeart />,
      title: "Purposeful Giving",
      desc: "Through our 'Bite Back' program, your growth helps improve children's health and happiness.",
    },
    {
      icon: <FaSyncAlt />,
      title: "Continuous Evolution",
      desc: "We evolve with you — constantly improving recipes and experiences based on feedback.",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-5 md:px-10">

        {/* ===== Title ===== */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-extrabold text-center text-gray-900 mb-10"
        >
          Our Story
        </motion.h2>

        {/* ===== Hero Statement ===== */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl font-semibold text-center text-gray-800 max-w-3xl mx-auto leading-relaxed"
        >
          More than a snack — a way of life.
        </motion.p>

        {/* ===== Story Paragraph ===== */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-gray-600 text-center max-w-3xl mx-auto leading-relaxed"
        >
          {/* At HyperBite, what you consume should fuel your next move. Whether you're chasing fitness goals, solving challenges, or exploring life — we are right there with you. We didn’t build just another snack. We built a catalyst for connection.
           */}
           At HyperBite, we believe that what you put into your body should do more than just satisfy hunger,it should fuel your next big move. Whether you are hitting a personal best in the gym, outsmarting an opponent on the chessboard, or riding across the rugged terrains of India, we are right there in your pocket. We didn’t build HyperBite to be another brand on a shelf. We built it to be a catalyst for connection. 

        </motion.p>

        {/* ===== Pillars Grid ===== */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {pillars.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition duration-300 bg-white"
            >
              {/* Icon */}
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 text-gray-800 mb-4">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default OurStorySection;
