import Link from "next/link";
import styles from "../home1.module.css";
import { Arrow } from "./shared";

export function GrowthSystemSection() {
  return (
    <section className={styles.system} data-theme="light">
      <div className={styles.systemCopy}>
        <p className={styles.kicker}>One connected system</p>
        <h2>Not Just Marketing.<br/>A Complete <span>Growth System.</span></h2>
        <p>Marketing, sales, automation and technology—all connected to help you grow faster and go further.</p>
        <ul><li><strong>Fully tailored</strong><span>No two packages are the same.</span></li><li><strong>One flat price</strong><span>A focused four-month engagement.</span></li><li><strong>End-to-end system</strong><span>Everything works together.</span></li></ul>
        <Link className={styles.outlineButton} href="/about">Learn more about us <Arrow /></Link>
      </div>
      <div className={styles.orbitPanel} data-theme="dark">
        <div className={styles.orbit}>
          <span className={styles.orbitCenter}><b>Sprynt40</b><small>Grow Loud!</small></span>
          <span className={styles.orbitOne}><b>Attract</b><small>SEO · Ads · Social</small></span>
          <span className={styles.orbitTwo}><b>Convert</b><small>Web · CRM · AI</small></span>
          <span className={styles.orbitThree}><b>Retain</b><small>Email · Loyalty</small></span>
          <span className={styles.orbitFour}><b>Grow</b><small>Data · Optimization</small></span>
          <span className={styles.orbitFive}><b>Build</b><small>Brand · Content</small></span>
        </div>
        <p className={styles.scribble}>Different pieces.<br/>One bigger picture.</p>
      </div>
    </section>
  );
}
