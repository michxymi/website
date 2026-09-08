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
    description: "@michxymi",
    icon: GithubIcon,
    name: "Github",
    url: "https://github.com/michxymi",
  },
  {
    description: "@michxymi",
    icon: XIcon,
    name: "X",
    url: "https://x.com/michxymi",
  },
  {
    description: "in/mxymitoulias",
    icon: LinkedInIcon,
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/mxymitoulias/",
  },
] as const satisfies readonly SocialLink[];
