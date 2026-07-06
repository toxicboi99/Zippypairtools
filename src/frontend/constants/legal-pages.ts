import { buildPageMetadata, type FaqItem } from "@/frontend/constants/seo";
import { siteConfig } from "@/frontend/constants/site";

export interface LegalPageSection {
  heading: string;
  body: string[];
}

export interface LegalPage {
  slug: string;
  title: string;
  description: string;
  updated: string;
  sections: LegalPageSection[];
  faqs?: FaqItem[];
}

export const legalPages: LegalPage[] = [
  {
    slug: "about",
    title: "About ZippyPair Tools",
    description:
      "Learn how ZippyPair Tools helps people complete everyday document, image, AI, developer, calculator, conversion, and security tasks quickly.",
    updated: "July 6, 2026",
    sections: [
      {
        heading: "Our purpose",
        body: [
          "ZippyPair Tools is a practical online toolbox for common digital tasks. The site is built for people who need a focused utility without installing software, creating an account, or navigating a heavy product dashboard.",
          "The current tool catalog covers PDF workflows, image utilities, media helpers, AI writing aids, developer tools, calculators, converters, text tools, SEO helpers, social utilities, and security generators.",
        ],
      },
      {
        heading: "How we build tools",
        body: [
          "Each tool is designed around a clear input, a predictable processing step, and a clean result. We prioritize speed, accessibility, understandable labels, and mobile-friendly layouts.",
          "When a workflow uses server-side processing, the interface is written to make upload states, processing states, results, and errors clear before the user takes action.",
        ],
      },
      {
        heading: "Who the site serves",
        body: [
          "ZippyPair Tools is useful for students, creators, office workers, developers, marketers, small businesses, and anyone who wants quick utilities for daily work.",
          `Questions about the site can be sent to ${siteConfig.contactEmail}.`,
        ],
      },
    ],
  },
  {
    slug: "contact",
    title: "Contact ZippyPair Tools",
    description:
      "Contact ZippyPair Tools for support, accessibility requests, policy questions, corrections, and business inquiries.",
    updated: "July 6, 2026",
    sections: [
      {
        heading: "Support email",
        body: [
          `For product support, corrections, accessibility requests, and policy questions, email ${siteConfig.contactEmail}. Include the page URL, tool name, device, browser, and a short description of the issue when possible.`,
          "We review messages in English and prioritize reports involving broken tools, privacy concerns, copyright issues, accessibility barriers, and inaccurate content.",
        ],
      },
      {
        heading: "Helpful details to include",
        body: [
          "For tool issues, describe the file type, input format, expected result, and actual result. Do not send sensitive personal documents unless we specifically request a safe sample.",
          "For legal or copyright requests, include your name, contact details, the exact URL involved, and enough information for us to evaluate the request responsibly.",
        ],
      },
    ],
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description:
      "Read how ZippyPair Tools handles privacy, analytics, uploaded files, cookies, security, and user communications.",
    updated: "July 6, 2026",
    sections: [
      {
        heading: "Information we process",
        body: [
          "ZippyPair Tools may process information you provide directly, such as files, text, URLs, settings, or support messages, only to operate the requested tool or respond to your inquiry.",
          "We may collect limited technical information such as browser type, device type, pages visited, referring pages, approximate location, and performance events through analytics or security tooling.",
        ],
      },
      {
        heading: "Files and tool inputs",
        body: [
          "Files and text submitted to tools are used to complete the selected workflow. Avoid uploading confidential, regulated, or highly sensitive information unless you are comfortable using an online utility for that material.",
          "Where a workflow can run locally or temporarily, we aim to minimize retention. Server-side processing may create temporary processing artifacts needed to complete a request.",
        ],
      },
      {
        heading: "Analytics, ads, and cookies",
        body: [
          "The site is prepared for Google Tag Manager, Google Analytics, Microsoft Clarity, and advertising technologies such as Google AdSense. These services may use cookies or similar identifiers when enabled.",
          "Cookies help measure site performance, understand popular tools, detect issues, and support advertising where applicable. Browser settings can be used to block or delete cookies.",
        ],
      },
      {
        heading: "Your choices",
        body: [
          `You can contact ${siteConfig.contactEmail} to ask privacy questions or request reasonable assistance with data-related concerns.`,
          "You can limit analytics and advertising identifiers through browser controls, device privacy settings, and applicable consent tools where available.",
        ],
      },
    ],
  },
  {
    slug: "terms-and-conditions",
    title: "Terms and Conditions",
    description:
      "Review the terms that apply when using ZippyPair Tools and its online utility workflows.",
    updated: "July 6, 2026",
    sections: [
      {
        heading: "Acceptance of terms",
        body: [
          "By using ZippyPair Tools, you agree to use the site lawfully, responsibly, and only for content or files you have the right to process.",
          "If you do not agree with these terms, do not use the website or submit files, URLs, or text to its tools.",
        ],
      },
      {
        heading: "Permitted use",
        body: [
          "You may use the tools for personal, educational, professional, and business tasks, provided your use does not violate laws, third-party rights, platform rules, or security controls.",
          "You may not attempt to overload the service, bypass rate limits, upload malicious files, reverse engineer private systems, or use the tools to create harmful, deceptive, or infringing material.",
        ],
      },
      {
        heading: "Service availability",
        body: [
          "We aim to keep the site fast and useful, but tools may change, fail, or become temporarily unavailable. Results should be reviewed before relying on them for important decisions.",
          "ZippyPair Tools is provided on an as-available basis without a guarantee that every result will be complete, error-free, or suitable for every use case.",
        ],
      },
    ],
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    description:
      "Understand the limitations of ZippyPair Tools, including informational content, AI outputs, calculations, conversions, and file processing.",
    updated: "July 6, 2026",
    sections: [
      {
        heading: "General information",
        body: [
          "ZippyPair Tools provides utilities and informational content for convenience. The site does not provide legal, financial, medical, tax, engineering, or professional advice.",
          "Always review outputs, calculations, conversions, generated text, and processed files before using them in important work.",
        ],
      },
      {
        heading: "AI and automated outputs",
        body: [
          "AI-assisted tools can produce incomplete, inaccurate, or unsuitable results. Users are responsible for reviewing generated content and confirming that it matches their needs and rights.",
          "Automated converters, compressors, parsers, and calculators are designed for common cases and may not handle every file, locale, or input format.",
        ],
      },
    ],
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    description:
      "Learn how ZippyPair Tools may use cookies, analytics tags, advertising tags, and similar browser storage.",
    updated: "July 6, 2026",
    sections: [
      {
        heading: "How cookies are used",
        body: [
          "Cookies and similar technologies may be used to remember basic preferences, measure page performance, analyze tool usage, detect errors, and support advertising when ad services are enabled.",
          "Google Tag Manager may be used to manage analytics, advertising, and measurement tags without changing the core website code for every tag update.",
        ],
      },
      {
        heading: "Managing cookies",
        body: [
          "Most browsers allow you to block, delete, or limit cookies. Blocking some cookies may affect analytics accuracy, personalization, or advertising measurement.",
          "Third-party services such as Google and Microsoft may provide their own opt-out controls and privacy settings.",
        ],
      },
    ],
  },
  {
    slug: "faqs",
    title: "Frequently Asked Questions",
    description:
      "Answers to common questions about ZippyPair Tools, supported workflows, privacy, uploads, AI tools, and accessibility.",
    updated: "July 6, 2026",
    sections: [
      {
        heading: "Short answers",
        body: [
          "ZippyPair Tools is a free online toolbox for everyday document, image, media, AI writing, developer, calculator, conversion, SEO, social, text, file, and security workflows.",
          "Most tools are designed to work quickly from a browser with clear inputs, focused settings, and clean result states.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is ZippyPair Tools free to use?",
        answer:
          "Yes. The listed tools are designed as free online utilities. Some third-party services, analytics, or ads may be enabled to support the site.",
      },
      {
        question: "Do I need an account?",
        answer:
          "No account is required for the public tool directory and standard workflows.",
      },
      {
        question: "Can I upload sensitive files?",
        answer:
          "Avoid uploading confidential, regulated, or highly sensitive files unless you are comfortable processing them through an online utility.",
      },
      {
        question: "Which tool categories are available?",
        answer:
          "The site includes PDF, image, media, AI writing, developer, calculator, converter, security, text, SEO, social, and file utility categories.",
      },
      {
        question: "How do I report a problem?",
        answer: `Email ${siteConfig.contactEmail} with the tool name, URL, browser, device, and a short description of what happened.`,
      },
    ],
  },
  {
    slug: "editorial-policy",
    title: "Editorial Policy",
    description:
      "Review how ZippyPair Tools writes, reviews, updates, and corrects informational content and tool guidance.",
    updated: "July 6, 2026",
    sections: [
      {
        heading: "Content standards",
        body: [
          "ZippyPair Tools aims to publish clear, practical, human-readable explanations that help users understand what a tool does, when to use it, and how to review the output.",
          "Content should be accurate, concise, original, and relevant to the tool or topic. We avoid intentionally misleading claims, hidden sponsorships, and unsupported guarantees.",
        ],
      },
      {
        heading: "Corrections and updates",
        body: [
          "We may update pages when tools change, policies evolve, or content needs clarification. Material errors can be reported by email for review.",
          "AI-assisted drafting may be used internally, but published policy and tool guidance should be reviewed for clarity, originality, and usefulness.",
        ],
      },
    ],
  },
  {
    slug: "content-policy",
    title: "Content Policy",
    description:
      "Understand what content and file uses are allowed or restricted on ZippyPair Tools.",
    updated: "July 6, 2026",
    sections: [
      {
        heading: "Allowed use",
        body: [
          "Users may process files, text, URLs, and settings that they own, control, or have permission to use.",
          "The tools are intended for lawful productivity, learning, formatting, conversion, accessibility, analysis, and creative workflows.",
        ],
      },
      {
        heading: "Restricted use",
        body: [
          "Do not use the site to process malware, stolen data, non-consensual intimate content, child exploitation material, hate or harassment campaigns, copyright-infringing material, or content that violates applicable law.",
          "Do not use AI or developer tools to create phishing, credential theft, evasion, impersonation, spam, or other harmful activity.",
        ],
      },
    ],
  },
  {
    slug: "advertising-policy",
    title: "Advertising Policy",
    description:
      "Learn how advertising may appear on ZippyPair Tools and how we separate ads from editorial and tool content.",
    updated: "July 6, 2026",
    sections: [
      {
        heading: "Advertising approach",
        body: [
          "ZippyPair Tools may use advertising, including Google AdSense or similar networks, to support free access to the site.",
          "Ads should not be intentionally presented as tool results, policy text, or editorial recommendations. Users should be able to distinguish advertising from site functionality.",
        ],
      },
      {
        heading: "Ad personalization",
        body: [
          "Advertising partners may use cookies or similar technologies to measure impressions, prevent fraud, and personalize ads where permitted.",
          "Users can manage ad personalization and tracking preferences through browser, device, and advertising network controls.",
        ],
      },
    ],
  },
  {
    slug: "dmca",
    title: "DMCA Policy",
    description:
      "Submit copyright complaints or counter-notices related to content on ZippyPair Tools.",
    updated: "July 6, 2026",
    sections: [
      {
        heading: "Copyright complaints",
        body: [
          `Copyright owners or authorized agents can send notices to ${siteConfig.contactEmail}. Include the copyrighted work, the URL or material at issue, your contact information, a good-faith statement, and a statement that the information is accurate.`,
          "We may remove or restrict access to material when a complaint appears valid and complete. Incomplete notices may require follow-up before action can be taken.",
        ],
      },
      {
        heading: "Counter-notices",
        body: [
          "If you believe material was removed in error, contact us with the relevant URL, your contact details, and an explanation of why you believe the content was lawful.",
          "Do not submit false copyright claims or counter-notices. Copyright disputes may have legal consequences.",
        ],
      },
    ],
  },
  {
    slug: "accessibility",
    title: "Accessibility Statement",
    description:
      "Read ZippyPair Tools' accessibility goals and how to report barriers affecting keyboard, screen reader, or visual access.",
    updated: "July 6, 2026",
    sections: [
      {
        heading: "Accessibility commitment",
        body: [
          "ZippyPair Tools aims to provide a usable experience for people navigating by keyboard, screen reader, touch, mouse, and mobile device.",
          "The site uses semantic headings, visible focus styles, descriptive labels, responsive layouts, and text contrast choices intended to support accessible use.",
        ],
      },
      {
        heading: "Report a barrier",
        body: [
          `If you find an accessibility issue, email ${siteConfig.contactEmail} with the page URL, device, browser, assistive technology if relevant, and a description of the barrier.`,
          "We review accessibility reports as product issues and use them to improve future updates.",
        ],
      },
    ],
  },
  {
    slug: "community-guidelines",
    title: "Community Guidelines",
    description:
      "Review the behavior and content expectations for people using or contacting ZippyPair Tools.",
    updated: "July 6, 2026",
    sections: [
      {
        heading: "Respectful use",
        body: [
          "Use the tools and contact channels respectfully. Do not submit abusive messages, malicious files, spam, impersonation attempts, or requests that target another person unfairly.",
          "Respect intellectual property, privacy, platform rules, and applicable law when processing files, URLs, text, or generated content.",
        ],
      },
      {
        heading: "Safety and enforcement",
        body: [
          "We may restrict abusive usage patterns, remove problematic material, or ignore requests that are unlawful, deceptive, harassing, or technically harmful.",
          "These guidelines help keep the site useful for everyday productivity and safe for long-term operation.",
        ],
      },
    ],
  },
];

export function getLegalPage(slug: string) {
  return legalPages.find((page) => page.slug === slug);
}

export function getLegalPageMetadata(slug: string) {
  const page = getLegalPage(slug);

  if (!page) return {};

  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: `/${page.slug}`,
    keywords: [page.title, siteConfig.name, "policy", "online tools"],
  });
}
