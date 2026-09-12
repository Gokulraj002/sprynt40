import styles from "../home1.module.css";

export function ResultsSection() {
  return (
    <section className={styles.results} data-theme="dark">
      <div className={styles.shell}>
        <div className={styles.resultsGrid}>
          <div><p className={styles.kickerDark}>The model</p><h2>Real Businesses.<br/><span>Real Growth.</span></h2></div>
          <blockquote>“Your growth plan should not be a pile of disconnected services. It should be one focused system—built for your business, measured clearly, and improved continuously.”<footer>Sprynt40 growth principle</footer></blockquote>
          <div className={styles.metricGrid}><div><strong>4</strong><span>Focused months</span></div><div><strong>1</strong><span>Flat price</span></div><div><strong>15</strong><span>Growth systems</span></div></div>
        </div>
      </div>
    </section>
  );
}
