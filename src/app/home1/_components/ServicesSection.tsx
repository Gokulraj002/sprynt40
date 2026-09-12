import Link from "next/link";
import styles from "../home1.module.css";
import { services } from "./data";
import { Arrow, HomeOneIcon } from "./shared";

export function ServicesSection() {
  return (
    <section className={styles.services} id="services" data-theme="light">
      <div className={styles.shell}>
        <div className={styles.sectionIntro}>
          <div><p className={styles.kicker}>Our services</p><h2>Everything You Need<br/>to <span>Grow.</span></h2></div>
          <div><p>We combine strategy, creative thinking and technology to help you attract, convert and retain more customers.</p><Link href="/services">Explore all services <Arrow /></Link></div>
        </div>
        <div className={styles.serviceGrid}>
          {services.map(([title, copy, icon]) => <article key={title} className={styles.serviceCard}><HomeOneIcon name={icon}/><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </div>
    </section>
  );
}
