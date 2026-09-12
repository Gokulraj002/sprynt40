"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./home1.module.css";

const plans = {
  visibility: {
    tab: "Get found",
    number: "01",
    title: "Turn your business into the obvious local choice.",
    description:
      "A visibility-first sprint connects search, paid reach, content and reputation so the right customers discover you more often.",
    systems: ["SEO & local presence", "Paid ads", "Social & content", "Reviews & reputation"],
    deliverables: ["Market and search-demand audit", "Campaign-ready landing journey", "90-day content direction", "Visibility reporting baseline"],
    signals: ["Search visibility", "Qualified enquiries", "Cost per lead"],
  },
  conversion: {
    tab: "Convert more",
    number: "02",
    title: "Turn more attention into qualified conversations.",
    description:
      "A conversion-first sprint removes friction between the first click and the sale, then makes every lead easier to follow up.",
    systems: ["Website & tech", "Conversion", "Leads, CRM & sales", "AI & automation"],
    deliverables: ["Conversion journey audit", "High-intent landing experience", "CRM pipeline and lead routing", "Automated nurture workflow"],
    signals: ["Conversion rate", "Response time", "Booked opportunities"],
  },
  retention: {
    tab: "Keep customers",
    number: "03",
    title: "Create more repeat revenue from every customer.",
    description:
      "A retention-first sprint gives customers a reason to return, refer and advocate while making their long-term value measurable.",
    systems: ["Email & messaging", "Loyalty & retention", "Reviews & reputation", "Revenue & data"],
    deliverables: ["Customer lifecycle map", "Loyalty and referral structure", "Win-back messaging flow", "Retention performance dashboard"],
    signals: ["Repeat purchases", "Customer value", "Review momentum"],
  },
} as const;

type PlanKey = keyof typeof plans;

export function GrowthPlanLab() {
  const [active, setActive] = useState<PlanKey>("visibility");
  const plan = plans[active];

  return (
    <section className={styles.planLab} id="plan-preview" data-theme="dark">
      <Image
        className={styles.planBackdrop}
        src="/images/home1/sprynt40-arrow-portal-v1.png"
        alt=""
        fill
        sizes="100vw"
        aria-hidden="true"
      />
      <div className={styles.planBackdropShade} aria-hidden="true" />
      <div className={styles.planGridLines} aria-hidden="true" />
      <div className={styles.shell}>
        <div className={styles.planIntro}>
          <div>
            <p className={styles.kickerDark}>Interactive plan preview</p>
            <h2>
              What Should Your<br />
              <span>Growth Sprint</span> Fix First?
            </h2>
          </div>
          <p>
            Choose the result that matters most right now. This is a preview of
            how we connect services around one business priority—not a generic
            package or a final recommendation.
          </p>
        </div>

        <div className={styles.planExperience}>
          <div className={styles.planControls} role="tablist" aria-label="Choose your primary growth goal">
            {(Object.keys(plans) as PlanKey[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active === key}
                aria-controls="growth-plan-panel"
                onClick={() => setActive(key)}
                className={active === key ? styles.planTabActive : styles.planTab}
              >
                <span>{plans[key].number}</span>
                {plans[key].tab}
                <i aria-hidden="true">→</i>
              </button>
            ))}

            <div className={styles.priceNote}>
              <span>How pricing works</span>
              <strong>One custom scope.<br />One four-month price.</strong>
              <p>No tier shopping, forced add-ons or open-ended retainer.</p>
            </div>
          </div>

          <div className={styles.planPanel} id="growth-plan-panel" role="tabpanel" aria-live="polite">
            <div className={styles.planPanelHead}>
              <span className={styles.planCounter}>{plan.number}</span>
              <span className={styles.planStatus}><i /> Priority mapped</span>
            </div>
            <h3>{plan.title}</h3>
            <p className={styles.planDescription}>{plan.description}</p>

            <div className={styles.planColumns}>
              <div>
                <p className={styles.planLabel}>Connected systems</p>
                <ul className={styles.systemChips}>
                  {plan.systems.map((system) => <li key={system}>{system}</li>)}
                </ul>
              </div>
              <div>
                <p className={styles.planLabel}>Likely sprint outputs</p>
                <ul className={styles.outputList}>
                  {plan.deliverables.map((item) => <li key={item}><span>✓</span>{item}</li>)}
                </ul>
              </div>
            </div>

            <div className={styles.signalRow}>
              <p className={styles.planLabel}>Signals we would watch</p>
              <div>{plan.signals.map((signal) => <span key={signal}>{signal}</span>)}</div>
            </div>

            <div className={styles.monthTrack} aria-label="Four-month delivery rhythm">
              {[
                ["M1", "Diagnose"],
                ["M2", "Build"],
                ["M3", "Activate"],
                ["M4", "Optimize"],
              ].map(([month, label]) => (
                <div key={month}><strong>{month}</strong><span>{label}</span></div>
              ))}
            </div>

            <div className={styles.planFooter}>
              <p><strong>Useful starting point.</strong> Your real plan is built after we study your business.</p>
              <Link href="/contact">Build my actual plan <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>

        <div className={styles.planBridge} aria-hidden="true">
          <span>Priority mapped</span>
          <i />
          <span>Four-month route</span>
        </div>
      </div>
    </section>
  );
}
