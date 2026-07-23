import { motion } from "framer-motion";
import "./Focus.css";

const ITEMS = [
  {
    label: "Building",
    value: "A modular vehicle physics toolkit for reuse across future client work.",
  },
  {
    label: "Learning",
    value: "Rust, for lower-level control over performance-critical systems.",
  },
  {
    label: "Availability",
    value: "Open for freelance and commissioned game systems.",
  },
];

function Focus() {
  return (
    <section id="focus" className="section focus">
      <div className="section-inner">
        <span className="eyebrow">Right now</span>
        <h2 className="section-heading">Current focus</h2>

        <div className="focus-list">
          {ITEMS.map((item, i) => (
            <motion.div
              className="focus-item"
              key={item.label}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="focus-status" />
              <div>
                <h3>{item.label}</h3>
                <p>{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Focus;
