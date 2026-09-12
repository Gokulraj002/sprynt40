import Link from "next/link";
import styles from "../home1.module.css";
import { faqs } from "./data";
import { Arrow } from "./shared";

export function FaqSection() {
  return (
    <section className={styles.faq} data-theme="light">
      <div className={styles.shell}>
        <div className={styles.faqGrid}><div><p className={styles.kicker}>FAQ</p><h2>Questions?<br/>We’ve Got Answers.</h2><Link className={styles.outlineButton} href="/contact">Ask us anything <Arrow /></Link></div><div className={styles.questions}>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></div>
      </div>
    </section>
  );
}
