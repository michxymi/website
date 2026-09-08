interface SiteWebMCPData {
  author: { name: string; jobTitle: string; worksFor: string };
  cvUrl: string;
  navigation: Array<{ title: string; url: string }>;
  socialLinks: Array<{ name: string; url: string }>;
}

interface WebMCPTool {
  annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
  description: string;
  execute: (
    input: Record<string, unknown>,
    client?: {
      requestUserInteraction?: (cb: () => Promise<unknown>) => Promise<unknown>;
    }
  ) => Promise<unknown>;
  inputSchema?: Record<string, unknown>;
  name: string;
}

interface WebMCPContext {
  modelContext?: {
    provideContext?: (context: {
      tools: Array<{
        name: string;
        description: string;
        inputSchema?: Record<string, unknown>;
        execute: (...args: unknown[]) => unknown;
      }>;
    }) => void;
    registerTool?: (...args: unknown[]) => void;
  };
}

function getData(): SiteWebMCPData | null {
  try {
    const el = document.getElementById("webmcp-data");
    return el?.textContent
      ? (JSON.parse(el.textContent) as SiteWebMCPData)
      : null;
  } catch {
    return null;
  }
}

function getPageContent(): string {
  return (
    document.querySelector("main")?.innerText ?? document.body?.innerText ?? ""
  );
}

const tools: WebMCPTool[] = [
  {
    annotations: { readOnlyHint: true },
    description:
      "Get structured information about the website and its author, Michael Xymitoulias.",
    execute: () => Promise.resolve(getData() ?? { content: getPageContent() }),
    inputSchema: { properties: {}, type: "object" },
    name: "get_site_info",
  },
  {
    annotations: { readOnlyHint: true },
    description:
      "Get the full text content of the current page the agent is viewing.",
    execute: () =>
      Promise.resolve({
        content: getPageContent(),
        title: document.title,
        url: window.location.href,
      }),
    inputSchema: { properties: {}, type: "object" },
    name: "get_page_content",
  },
  {
    annotations: { readOnlyHint: true },
    description:
      "Get the site navigation structure with available page titles and URLs.",
    execute: () => Promise.resolve({ navigation: getData()?.navigation ?? [] }),
    inputSchema: { properties: {}, type: "object" },
    name: "get_navigation",
  },
  {
    annotations: { readOnlyHint: true },
    description: "Get Michael Xymitoulias's social media profile links.",
    execute: () =>
      Promise.resolve({ socialLinks: getData()?.socialLinks ?? [] }),
    inputSchema: { properties: {}, type: "object" },
    name: "get_social_links",
  },
  {
    description:
      "Navigate to a page on the website. Available routes: / (about), /now, /blog, /projects, /contact.",
    execute: (input) => {
      const path = String(input.path ?? "/");
      window.location.href = path;
      return Promise.resolve({ navigated: true, to: path });
    },
    inputSchema: {
      properties: {
        path: {
          description:
            "The URL path to navigate to (e.g., /blog, /projects, /contact, /now)",
          type: "string",
        },
      },
      required: ["path"],
      type: "object",
    },
    name: "navigate_to",
  },
  {
    annotations: { readOnlyHint: true },
    description: "Get the URL to download Michael Xymitoulias's CV/resume.",
    execute: () => {
      const data = getData();
      if (!data) {
        return Promise.resolve({ cvUrl: null });
      }
      return Promise.resolve({
        cvUrl: new URL(data.cvUrl, window.location.origin).toString(),
      });
    },
    inputSchema: { properties: {}, type: "object" },
    name: "get_cv",
  },
  {
    annotations: { readOnlyHint: true },
    description:
      "Search blog posts by keyword. Fetches the RSS feed and returns matching posts.",
    execute: async (input) => {
      const query = String(input.query ?? "").toLowerCase();
      if (!query) {
        return { results: [] };
      }

      const response = await fetch("/feed.xml");
      const text = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "text/xml");
      const entries = xml.querySelectorAll("entry");
      const results: Array<{
        title: string;
        link: string;
        published: string;
        summary: string;
      }> = [];

      for (const entry of entries) {
        const title = entry.querySelector("title")?.textContent ?? "";
        const summary = entry.querySelector("summary")?.textContent ?? "";
        const link = entry.querySelector("link")?.getAttribute("href") ?? "";
        const published = entry.querySelector("published")?.textContent ?? "";

        if (
          title.toLowerCase().includes(query) ||
          summary.toLowerCase().includes(query)
        ) {
          results.push({ link, published, summary, title });
        }
      }

      return { query: input.query, results };
    },
    inputSchema: {
      properties: {
        query: {
          description: "Search keyword to find matching blog posts",
          type: "string",
        },
      },
      required: ["query"],
      type: "object",
    },
    name: "search_blog_posts",
  },
];

export function registerWebMCPTools(): void {
  const mc = (navigator as unknown as WebMCPContext).modelContext;
  if (!mc) {
    return;
  }

  const abortController = new AbortController();

  if (mc.provideContext) {
    mc.provideContext({ tools } as never);
    window.addEventListener("beforeunload", () => abortController.abort(), {
      once: true,
    });
    return;
  }

  if (mc.registerTool) {
    for (const tool of tools) {
      try {
        const { annotations, ...toolDef } = tool;
        mc.registerTool(
          { ...toolDef, ...(annotations ? { annotations } : {}) },
          { signal: abortController.signal }
        );
      } catch {
        // Individual tool registration failed
      }
    }
    window.addEventListener("beforeunload", () => abortController.abort(), {
      once: true,
    });
  }
}
