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
    name: "get_site_info",
    description:
      "Get structured information about the website and its author, Michael Xymitoulias.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: () => Promise.resolve(getData() ?? { content: getPageContent() }),
  },
  {
    name: "get_page_content",
    description:
      "Get the full text content of the current page the agent is viewing.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: () =>
      Promise.resolve({
        url: window.location.href,
        title: document.title,
        content: getPageContent(),
      }),
  },
  {
    name: "get_navigation",
    description:
      "Get the site navigation structure with available page titles and URLs.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: () => Promise.resolve({ navigation: getData()?.navigation ?? [] }),
  },
  {
    name: "get_social_links",
    description: "Get Michael Xymitoulias's social media profile links.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: () =>
      Promise.resolve({ socialLinks: getData()?.socialLinks ?? [] }),
  },
  {
    name: "navigate_to",
    description:
      "Navigate to a page on the website. Available routes: / (about), /now, /blog, /projects, /contact.",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description:
            "The URL path to navigate to (e.g., /blog, /projects, /contact, /now)",
        },
      },
      required: ["path"],
    },
    execute: (input) => {
      const path = String(input.path ?? "/");
      window.location.href = path;
      return Promise.resolve({ navigated: true, to: path });
    },
  },
  {
    name: "get_cv",
    description: "Get the URL to download Michael Xymitoulias's CV/resume.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: () => {
      const data = getData();
      if (!data) {
        return Promise.resolve({ cvUrl: null });
      }
      return Promise.resolve({
        cvUrl: new URL(data.cvUrl, window.location.origin).toString(),
      });
    },
  },
  {
    name: "search_blog_posts",
    description:
      "Search blog posts by keyword. Fetches the RSS feed and returns matching posts.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search keyword to find matching blog posts",
        },
      },
      required: ["query"],
    },
    annotations: { readOnlyHint: true },
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
          results.push({ title, link, published, summary });
        }
      }

      return { query: input.query, results };
    },
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
