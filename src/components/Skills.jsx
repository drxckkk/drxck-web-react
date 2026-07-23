import { motion } from "framer-motion";
import "./Skills.css";

const GROUPS = [
  { label: "Languages", items: ["C#", "Lua", "Java", "TypeScript"] },
  { label: "Frameworks", items: ["React", "Framer Motion", "Node.js"] },
  { label: "Game Development", items: ["Roblox Studio", "Unity", "Godot"] },
];

function Skills() {
  return (
    <section id="skills" className="section skills">
      <div className="section-inner">
        <span className="eyebrow">Toolbox</span>
        <h2 className="section-heading">Skills &amp; technologies</h2>

        <div className="skill-groups">
          {GROUPS.map((group, gi) => (
            <div className="skill-group" key={group.label}>
              <h3>{group.label}</h3>
              <div className="pill-row">
                {group.items.map((item, i) => (
                  <motion.span
                    className="pill"
                    key={item}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{
                      duration: 0.5,
                      delay: gi * 0.05 + i * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{ y: -3 }}
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
