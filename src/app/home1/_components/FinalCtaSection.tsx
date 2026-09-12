import Image from "next/image";
import Link from "next/link";
import styles from "../home1.module.css";
import { Arrow } from "./shared";

export function FinalCtaSection() {
  return (
    <section className={styles.finalCta} data-theme="dark">
      <Image src="/images/home1/sprynt40-consultation-door-v1.png" alt="A business leader stepping into a bright future" fill sizes="100vw"/>
      <div className={styles.finalShade}/>
      <div className={styles.shell}><div className={styles.finalCopy}><h2>Ready to Grow Loud?<br/><span>Let’s Build Your Custom Plan.</span></h2><p>Book a call—we’ll study your business, then send back a tailored four-month package with one flat price.</p><div className={styles.heroActions}><Link className={styles.primaryButton} href="/contact">Book a free consultation <Arrow /></Link><a className={styles.email} href="mailto:hello@sprynt40.online">or email us<br/><strong>hello@sprynt40.online</strong></a></div></div></div>
    </section>
  );
}
