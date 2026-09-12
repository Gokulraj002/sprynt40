import Image from "next/image";
import Link from "next/link";
import styles from "./hero.module.css";
import { Arrow, HomeOneIcon } from "./shared";

export function HeroSection() {
  return (
    <section className={styles.hero} data-theme="dark" aria-labelledby="home1-hero-title">
      <Image className={styles.artwork} src="/images/home1/sprynt40-growth-portal-hero-v3.png" alt="A business leader climbing illuminated steps toward a monumental orange arrow portal and bright city skyline" fill priority sizes="100vw" />
      <div className={styles.scrim} />
      <div className={styles.frame} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Complete business growth solutions</p>
          <h1 className={styles.title} id="home1-hero-title">Turning Today&apos;s<br/>Effort into Tomorrow&apos;s <span>Growth.</span></h1>
          <p className={styles.lead}>From marketing to automation — one tailored system built around your business, not a fixed package.</p>
          <div className={styles.benefits} aria-label="Growth outcomes">
            <div className={styles.benefit}><HomeOneIcon name="chart" /><small>More</small><strong>Visibility</strong></div>
            <div className={styles.benefit}><HomeOneIcon name="people" /><small>More</small><strong>Customers</strong></div>
            <div className={styles.benefit}><HomeOneIcon name="growth" /><small>More</small><strong>Revenue</strong></div>
          </div>
          <div className={styles.actions}>
            <Link className={styles.primary} href="/contact">Get Your Custom Plan <Arrow /></Link>
            <a className={styles.secondary} href="#process"><span className={styles.play} aria-hidden="true">▶</span> See How It Works</a>
          </div>
          <div className={styles.journey}><span>Ideas</span><i>→</i><span>Strategy</span><i>→</i><span>Execution</span><i>→</i><span>Growth</span></div>
        </div>
      </div>
      <aside className={styles.rail} aria-label="Sprynt40 growth statement">
        <em className={styles.railScript}>Grow<br/>Loud!</em>
        <p className={styles.railList}>Brands<br/>People<br/>Businesses<br/>Communities</p>
        <i className={styles.railRule} />
        <span className={styles.railTag}>A brighter<br/>bolder<br/>tomorrow</span>
      </aside>
    </section>
  );
}
