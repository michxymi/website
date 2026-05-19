const PRE_LANG_RE = /class="[^"]*(?:language-|lang-)(\w+)[^"]*"/i;
const LEADING_NEWLINES_RE = /^\n+/;
const HTML_TAG_RE = /<(?:"[^"]*"|'[^']*'|[^'">])*>/g;
const MAIN_RE = /<main(?:\s[^>]*)?>([\s\S]*?)<\/main>/i;

export function htmlToMarkdown(html: string): string {
  let text = html;

  text = text.replace(/<head[\s\S]*?<\/head>/gi, "");
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");

  const main = text.match(MAIN_RE);
  if (main?.[1]) {
    text = main[1];
  }

  text = text.replace(/<nav[\s\S]*?<\/nav>/gi, "");
  text = text.replace(/<aside[\s\S]*?<\/aside>/gi, "");
  text = text.replace(/<footer[\s\S]*?<\/footer>/gi, "");

  text = text.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n# $1\n");
  text = text.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n## $1\n");
  text = text.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n### $1\n");
  text = text.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "\n#### $1\n");
  text = text.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "\n##### $1\n");
  text = text.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "\n###### $1\n");

  text = text.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
  text = text.replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**");
  text = text.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*");
  text = text.replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*");
  text = text.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");

  text = text.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, code) => {
    const lang = _.match(PRE_LANG_RE)?.[1] ?? "";
    const content = code.replace(/<code[^>]*>/gi, "").replace(/<\/code>/gi, "");
    return `\n\`\`\`${lang}\n${stripTags(content)}\n\`\`\`\n`;
  });

  text = text.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
  text = text.replace(
    /<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi,
    "![$2]($1)"
  );
  text = text.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, "![]($1)");

  text = text.replace(
    /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi,
    (_, content) => {
      const lines = stripTags(content).trim().split("\n");
      return `\n${lines.map((l) => `> ${l}`).join("\n")}\n`;
    }
  );

  text = text.replace(/<hr\s*\/?>/gi, "\n---\n");

  text = text.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, list) => {
    const items = list.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
    if (!items) {
      return "";
    }
    return (
      "\n" +
      items
        .map((item: string) => {
          const content = item.replace(/<\/?li[^>]*>/gi, "").trim();
          return `- ${content}`;
        })
        .join("\n") +
      "\n"
    );
  });

  text = text.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, list) => {
    const items = list.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
    if (!items) {
      return "";
    }
    return (
      "\n" +
      items
        .map((item: string, i: number) => {
          const content = item.replace(/<\/?li[^>]*>/gi, "").trim();
          return `${i + 1}. ${content}`;
        })
        .join("\n") +
      "\n"
    );
  });

  text = text.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n");

  text = text.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n$1\n");
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(
    /<header(?:"[^"]*"|'[^']*'|[^'">])*>[\s\S]*?<\/header>/gi,
    ""
  );
  text = text.replace(/<\/?(?:div|span)(?:"[^"]*"|'[^']*'|[^'">])*>/gi, "");

  text = stripTags(text);

  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/&nbsp;/g, " ");

  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.replace(LEADING_NEWLINES_RE, "");
  text = text.trim();

  return text;
}

function stripTags(text: string): string {
  return text.replace(HTML_TAG_RE, "");
}
