export function HomeOneIcon({ name }: { name: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, React.ReactNode> = {
    screen: <><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
    megaphone: <><path d="M4 13v-2l13-5v12L4 13Z"/><path d="M7 14v5h4l1-4M19 9l2-2M19 15l2 2"/></>,
    people: <><circle cx="8" cy="8" r="3"/><circle cx="17" cy="7" r="3"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="17" r="3"/></>,
    star: <path d="m12 2 3 6 7 .9-5 4.8 1.3 6.8L12 17l-6.3 3.5L7 13.7 2 8.9 9 8l3-6Z"/>,
    palette: <><path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h3a6 6 0 0 0-3-10Z"/><circle cx="7.5" cy="9" r=".8" fill="currentColor"/><circle cx="10" cy="6.5" r=".8" fill="currentColor"/></>,
    growth: <><path d="M4 20V10M10 20V6M16 20v-9M22 20V3"/><path d="m3 7 6-4 6 4 7-5"/></>,
    user: <><circle cx="12" cy="7" r="4"/><path d="M4 22c0-5 3-8 8-8s8 3 8 8"/></>,
    mail: <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></>,
    gift: <><rect x="3" y="9" width="18" height="12" rx="1"/><path d="M12 9v12M2 9h20M7 9c-4 0-4-5-1-5 2.5 0 4 5 6 5M17 9c4 0 4-5 1-5-2.5 0-4 5-6 5"/></>,
    bot: <><rect x="4" y="7" width="16" height="13" rx="4"/><path d="M12 3v4M8 13h.01M16 13h.01M8 17h8"/></>,
    chart: <path d="M4 21V11M10 21V6M16 21v-8M22 21V3"/>,
    delivery: <><path d="M3 7h11v11H3zM14 11h4l3 4v3h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></>,
    video: <><rect x="3" y="6" width="14" height="13" rx="2"/><path d="m17 11 5-3v9l-5-3zM8 6l1-3h4l1 3"/></>,
    report: <><path d="M5 3h14v18H5zM8 16v2M12 12v6M16 8v10"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}>{paths[name]}</svg>;
}

export function Arrow() {
  return <span aria-hidden="true">→</span>;
}
