const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 * @see {@link https://docs.base.org/mini-apps/core-concepts/manifest}
 */
export const farcasterConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: ""
  },
  appId: "69932c0a7ca07f5750bbdba7",
  miniapp: {
    version: "1",
    name: "Base Memory",
    subtitle: "Тренируй память on-chain",
    description: "Классическая игра Simon Says с Web3 лидербордом на Base L2",
    homeUrl: ROOT_URL,
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#000000",
    screenshotUrls: [
      `${ROOT_URL}/screenshot-portrait.png`,
      `${ROOT_URL}/screenshot.png`
    ],
    primaryCategory: "games",
    tags: ["games", "memory", "web3", "leaderboard", "base"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "Докажи свою память on-chain",
    ogTitle: "Base Memory - Web3 Memory Game",
    ogDescription: "Классическая игра на память с децентрализованным лидербордом",
    ogImageUrl: `${ROOT_URL}/hero.png`,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    noindex: false,
  },
} as const;