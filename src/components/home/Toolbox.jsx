import { Blocks } from "lucide-react";
import { CAPABILITIES, STACK } from "../../data/uses";
import { PRINCIPLES } from "../../data/profile";
import "./Toolbox.css";

function Toolbox() {
  return (
    <section id="uses" className="section home-toolbox" data-nav-section="about">
      <div className="shell">
        <header className="section-head" data-reveal>
          <p className="eyebrow">What I use</p>
          <h2 className="title-l">The kit behind the work.</h2>
        </header>

        <div className="toolbox-grid">
          <article className="card stack-card" data-reveal>
            <h3 className="card-label">
              <Blocks aria-hidden="true" strokeWidth={2} />
              Development
            </h3>
            <ul className="stack-table">
              {STACK.map((item, i) => (
                <li className="stack-cell" key={item.name} style={{ "--brand": item.color }}>
                  <span className="stack-number" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="stack-symbol" aria-hidden="true">
                    {item.symbol}
                  </span>
                  <span className="stack-name">{item.name}</span>
                </li>
              ))}
            </ul>

            <h3 className="card-label stack-subhead">What I build</h3>
            <ul className="stack-capabilities">
              {CAPABILITIES.map((item) => (
                <li className="chip" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </article>


          <article className="card principles-card" data-reveal>
            <h3 className="card-label">How I work</h3>
            <ol className="principles">
              {PRINCIPLES.map((principle, i) => (
                <li className="principle" key={principle.title}>
                  <span className="principle-number" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="principle-title">{principle.title}</span>
                  <span className="principle-body">{principle.body}</span>
                </li>
              ))}
            </ol>
          </article>
        </div>
      </div>
    </section>
  );
}

export default Toolbox;
