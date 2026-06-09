const footerColumns = [
  {
    title: "Product",
    links: ["Saved Moves", "Move Planner"],
  },
  {
    title: "Data Sources",
    links: ["Numbeo", "OECD", "World Bank", "Local Surveys"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Contact", "Changelog"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security", "Cookies"],
  },
];

const socialLinks = [
  {
    label: "X",
    href: "https://x.com",
    icon: (
      <path
        d="M4 4l11.8 16h4.2L8.2 4H4Zm1.9 1.5h1.6l10.6 13h-1.6L5.9 5.5ZM4.1 20h2.1L20 4h-2.1L4.1 20Z"
        fill="currentColor"
      />
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com",
    icon: (
      <path
        d="M6.8 9.3H3.7V20h3.1V9.3ZM5.2 4a1.8 1.8 0 1 0 0 3.6A1.8 1.8 0 0 0 5.2 4Zm14.7 10c0-3.2-1.7-4.9-4.1-4.9a3.5 3.5 0 0 0-3.1 1.7V9.3h-3V20h3.1v-5.8c0-1.5.8-2.4 2-2.4s1.9.8 1.9 2.4V20h3.2v-6Z"
        fill="currentColor"
      />
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com",
    icon: (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3.5A8.5 8.5 0 0 0 9.3 20c.4.1.6-.2.6-.4v-1.5c-2.3.5-2.8-1-2.8-1-.4-1-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.8.8 2.3.6.1-.5.3-.8.5-1-1.8-.2-3.8-.9-3.8-4.1 0-.9.3-1.6.8-2.2-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.3.8A8.1 8.1 0 0 1 12 7.9c.8 0 1.5.1 2.2.3 1.6-1 2.3-.8 2.3-.8.5 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.2 0 3.2-1.9 3.9-3.8 4.1.3.3.6.8.6 1.6v2.2c0 .2.2.5.6.4A8.5 8.5 0 0 0 12 3.5Z"
        fill="currentColor"
      />
    ),
  },
];

const Footer = () => (
  <footer className="app-footer">
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(14rem,0.9fr)_minmax(0,2.6fr)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="brand-mark text-white" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 21s7-5.4 7-12a7 7 0 1 0-14 0c0 6.6 7 12 7 12Z" stroke="currentColor" strokeWidth="2" />
                <path d="M12 12.2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <p className="font-display text-sm font-semibold text-[var(--text-primary)]">
              Relocation Companion
            </p>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[var(--text-muted)]">
            Data-driven relocation intelligence for comparing cities, costs, and quality of life.
          </p>
        </div>

        <div className="footer-column-grid">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-primary)]">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a className="footer-link" href="#top">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="border-t border-[var(--border-subtle)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-xs font-semibold text-[var(--text-muted)]">
          Copyright {new Date().getFullYear()} Relocation Companion. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              className="footer-social-link"
              href={social.href}
              aria-label={social.label}
              title={social.label}
              target="_blank"
              rel="noreferrer"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                {social.icon}
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
