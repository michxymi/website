import GithubIcon from "@tabler/icons/outline/brand-github.svg";
import LinkedInIcon from "@tabler/icons/outline/brand-linkedin.svg";
import XIcon from "@tabler/icons/outline/brand-x.svg";

export interface SocialLink {
  description?: string;
  icon: typeof GithubIcon | typeof LinkedInIcon | typeof XIcon;
  name: string;
  url: string;
}

export const SOCIAL_LINKS = [
  {
    name: "Github",
    url: "https://github.com/michxymi",
    icon: GithubIcon,
    description: "@michxymi",
  },
  {
    name: "X",
    url: "https://x.com/michxymi",
    icon: XIcon,
    description: "@michxymi",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/mxymitoulias/",
    icon: LinkedInIcon,
    description: "in/mxymitoulias",
  },
] as const satisfies readonly SocialLink[];
