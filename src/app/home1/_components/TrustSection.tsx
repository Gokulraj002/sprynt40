import styles from "../home1.module.css";

export function TrustSection() {
  return (
    <section className={styles.trust} aria-label="Core platforms">
      <div className={styles.shell}>
        <p className={styles.trustLabel}>Built for ambitious brands</p>
        <div className={styles.logoRow}><span>Google</span><span>Meta</span><span>Shopify</span><span>AWS</span><span>Odoo</span><span>Freshworks</span></div>
      </div>
    </section>
  );
}
