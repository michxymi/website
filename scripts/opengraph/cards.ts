type Style = Record<string, string | number>;
type Child = VNode | string | number | null | undefined | false;
type Children = Child | Child[];

interface VNode {
  props: Record<string, unknown>;
  type: string;
}

function h(
  type: string,
  props: Record<string, unknown> | null,
  ...children: Children[]
): VNode {
  const flat = children.flat(10);
  const cs = flat.filter(
    (c): c is VNode | string | number => c != null && c !== false
  );
  return {
    type,
    props: {
      ...(props ?? {}),
      ...(cs.length > 0 ? { children: cs.length === 1 ? cs[0] : cs } : {}),
    },
  };
}

function div(style: Style | null, ...children: Children[]): VNode {
  return h("div", style ? { style } : null, ...children);
}

const BG = "#0a0a0a";
const FG = "#fafafa";
const MUTED = "#a1a1aa";
const SUBTLE = "#737373";
const BORDER = "#27272a";

interface CardProps {
  footerLeft?: string;
  footerTags?: string[];
  label: string;
  subtitle?: string;
  subtitleFontSize?: number;
  title: string;
  titleFontSize?: number;
}

function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max).trim()}…`;
}

const labelStyle: Style = {
  color: MUTED,
  fontSize: 20,
  fontFamily: "JetBrains Mono",
  fontWeight: 500,
  letterSpacing: "0.15em",
};

const footerStyle: Style = {
  color: SUBTLE,
  fontSize: 18,
  fontFamily: "JetBrains Mono",
};

const outerStyle: Style = {
  display: "flex",
  flexDirection: "column",
  width: 1200,
  height: 630,
  background: BG,
  padding: 64,
};

const centerStyle: Style = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  justifyContent: "center",
  gap: 24,
};

const metaStyle: Style = {
  display: "flex",
  gap: 8,
  color: SUBTLE,
  fontSize: 14,
  fontFamily: "JetBrains Mono",
};

const hrStyle: Style = {
  height: 1,
  background: BORDER,
  width: "100%",
};

const titleStyle: Style = {
  color: FG,
  fontWeight: 600,
  lineHeight: 1.1,
  fontFamily: "IBM Plex Sans",
};

const subtitleStyle: Style = {
  color: MUTED,
  lineHeight: 1.4,
  fontFamily: "IBM Plex Sans",
};

function FlexRow(style: Style | null, ...children: Children[]): VNode {
  return h(
    "div",
    { style: { display: "flex", ...(style ?? {}) } },
    ...children
  );
}

function FlexCol(style: Style | null, ...children: Children[]): VNode {
  return h(
    "div",
    { style: { display: "flex", flexDirection: "column", ...(style ?? {}) } },
    ...children
  );
}

export function DefaultCard(): VNode {
  return div(
    outerStyle,
    div(labelStyle, "Portfolio"),
    div(
      centerStyle,
      div({ ...titleStyle, fontSize: 72 }, "Michael Xymitoulias"),
      div(
        { ...subtitleStyle, fontSize: 28 },
        "Full Stack Software Engineer · Engineering Manager"
      )
    ),
    FlexCol(
      { marginTop: 32, gap: 24 },
      div(hrStyle),
      FlexRow(
        { alignItems: "center", justifyContent: "flex-end" },
        div(footerStyle, "michxymi.com")
      )
    )
  );
}

export function PostCard(post: CardProps): VNode {
  const title = truncate(post.title, 70);
  const subtitle = post.subtitle ? truncate(post.subtitle, 140) : undefined;

  return div(
    outerStyle,
    div(labelStyle, "Blog"),
    div(
      centerStyle,
      div({ ...titleStyle, fontSize: post.titleFontSize ?? 64 }, title),
      subtitle
        ? div(
            { ...subtitleStyle, fontSize: post.subtitleFontSize ?? 24 },
            subtitle
          )
        : null
    ),
    FlexCol(
      { marginTop: 32, gap: 24 },
      div(hrStyle),
      FlexRow(
        { alignItems: "center", justifyContent: "space-between" },
        post.footerLeft ? div(metaStyle, post.footerLeft) : div(null),
        div(footerStyle, "michxymi.com")
      )
    )
  );
}

export function ProjectCard(project: CardProps): VNode {
  const title = truncate(project.title, 70);
  const subtitle = project.subtitle
    ? truncate(project.subtitle, 140)
    : undefined;

  return div(
    outerStyle,
    div(labelStyle, "Project"),
    div(
      centerStyle,
      div({ ...titleStyle, fontSize: 64 }, title),
      subtitle ? div({ ...subtitleStyle, fontSize: 24 }, subtitle) : null
    ),
    FlexCol(
      { marginTop: 32, gap: 24 },
      div(hrStyle),
      FlexRow(
        { alignItems: "center", justifyContent: "flex-end" },
        div(footerStyle, "michxymi.com")
      )
    )
  );
}
