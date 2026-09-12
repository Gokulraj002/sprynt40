import Image from "next/image";
import Link from "next/link";
import styles from "../home1.module.css";
import { Arrow, HomeOneIcon } from "./shared";

export function HeroSection() {
  return (
    <section className={styles.hero} data-theme="dark">
      <Image className={styles.heroImage} src="/images/home1/sprynt40-staircase-portal-v2.png" alt="A business leader climbing illuminated steps toward a monumental orange arrow portal" fill priority sizes="100vw" />
      <div className={styles.heroShade} />
      <div className={styles.heroWide}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Complete business growth solutions</p>
          <h1>From Today<br/>to <span>What&apos;s Next.</span></h1>
          <p className={styles.lead}>Marketing, technology, automation and more—one tailored system built around your business, not a fixed package.</p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href="/contact">Get your custom plan <Arrow /></Link>
            <a className={styles.secondaryButton} href="#process">See how it works <span className={styles.play}>▶</span></a>
          </div>
          <div className={styles.heroBenefits}>
            <div><span>More</span><strong>Visibility</strong><HomeOneIcon name="chart" /></div>
            <div><span>More</span><strong>Customers</strong><HomeOneIcon name="people" /></div>
            <div><span>More</span><strong>Revenue</strong><HomeOneIcon name="growth" /></div>
          </div>
          <div className={styles.heroJourney}><span>Ideas</span><i>→</i><span>Strategy</span><i>→</i><span>Execution</span><i>→</i><span>Growth</span></div>
        </div>
      </div>

      <div className={`${styles.heroFloatCard} ${styles.heroFloatMarketing}`}><HomeOneIcon name="chart"/><div><strong>Marketing</strong><span>Turn attention<br/>into customers.</span></div></div>
      <div className={`${styles.heroFloatCard} ${styles.heroFloatSales}`}><HomeOneIcon name="people"/><div><strong>Sales</strong><span>Capture, nurture<br/>and convert.</span></div></div>
      <div className={`${styles.heroFloatCard} ${styles.heroFloatAutomation}`}><HomeOneIcon name="bot"/><div><strong>Automation</strong><span>Let technology<br/>do the work.</span></div></div>

      <aside className={styles.heroRail} aria-label="Sprynt40 growth statement">
        <p>Brands<br/>People<br/>Businesses<br/>Communities</p>
        <strong>Grow Loud.</strong><i /><span>A brighter<br/>bolder<br/>tomorrow</span><em>Grow<br/>Loud!</em>
      </aside>
    </section>
  );
}
