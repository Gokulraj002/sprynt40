import Image from "next/image";
import styles from "../home1.module.css";
import { process } from "./data";

export function ProcessSection() {
  return (
    <section className={styles.process} id="process" data-theme="dark">
      <Image className={styles.processImage} src="/images/home1/sprynt40-growth-mountain-v1.png" alt="A glowing orange trail reaching a mountain summit" fill sizes="100vw" />
      <div className={styles.processShade}/>
      <div className={styles.shell}>
        <p className={styles.kickerDark}>How it works</p>
        <h2>A Simple <span>4-Step</span> Process.</h2>
        <p className={styles.processLead}>No confusion. No long contracts. Just a clear plan to grow your business.</p>
        <div className={styles.steps}>{process.map(([title, copy], index) => <article key={title}><div className={styles.stepTop}><strong>0{index + 1}</strong><i/></div><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div>
    </section>
  );
}
