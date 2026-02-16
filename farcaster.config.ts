const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const farcasterConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: ""
  },
  miniapp: {
    version: "1",
    name: "Base Memory", 
    subtitle: "Тренируй память on-chain", 
    description: "Классическая игра Simon Says с Web3 лидербордом на Base L2",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/memory-icon.png`,
    splashImageUrl: `${ROOT_URL}/memory-splash.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "game",
    tags: ["game", "memory", "web3", "leaderboard", "base"],
    heroImageUrl: `${ROOT_URL}/memory-hero.png`, 
    tagline: "Докажи свою память on-chain",
    ogTitle: "Base Memory - Web3 Memory Game",
    ogDescription: "Классическая игра на память с децентрализованным лидербордом",
    ogImageUrl: `${ROOT_URL}/memory-hero.png`,
  },
} as const;

