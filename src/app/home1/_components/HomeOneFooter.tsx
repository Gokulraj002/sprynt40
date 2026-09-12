import Image from "next/image";
import Link from "next/link";
import styles from "../home1.module.css";

export function HomeOneFooter() {
  return (
    <footer className={styles.customFooter} data-theme="dark">
      <div className={styles.shell}><div className={styles.footerGrid}><div><Image className={styles.footerLogo} src="/logos.jpeg" alt="Sprynt40 — Grow Loud!" width={1600} height={1600}/><p>Digital growth solutions for businesses ready to move forward.</p></div><nav><strong>Quick links</strong><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/services">Services</Link><Link href="/work">Work</Link><Link href="/contact">Contact</Link></nav><nav><strong>Our services</strong><a href="#services">Website & Tech</a><a href="#services">SEO & Local</a><a href="#services">Paid Ads</a><a href="#services">AI & Automation</a><Link href="/services">View all services</Link></nav><div><strong>Let’s grow</strong><a href="mailto:hello@sprynt40.online">hello@sprynt40.online</a><p>Andhra Pradesh, India</p><em>Grow<br/>Loud!</em></div></div><div className={styles.copyright}><span>© 2026 Sprynt40. All rights reserved.</span><span><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms & Conditions</Link></span></div></div>
    </footer>
  );
}
