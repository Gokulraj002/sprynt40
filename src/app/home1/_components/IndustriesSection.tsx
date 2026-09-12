import Image from "next/image";
import Link from "next/link";
import styles from "../home1.module.css";
import { industries } from "./data";
import { Arrow } from "./shared";

export function IndustriesSection() {
  return (
    <section className={styles.industries} id="industries" data-theme="light">
      <div className={styles.shell}>
        <div className={styles.sectionIntro}>
          <div><p className={styles.kicker}>Industries we serve</p><h2>Different Businesses.<br/><span>One Growth Mindset.</span></h2></div>
          <div><p>Whether you run a café, a retail brand or a growing service business—our strategies are tailored to your industry.</p><Link href="/contact">Discuss your industry <Arrow /></Link></div>
        </div>
        <div className={styles.industryRail}>{industries.map(([title, src, alt]) => <article key={title}><Image src={src} alt={alt} fill loading="eager" unoptimized sizes="(max-width: 700px) 70vw, 18vw"/><div/><h3>{title}</h3></article>)}</div>
      </div>
    </section>
  );
}
