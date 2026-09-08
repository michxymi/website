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
    (c): c is VNode | string | number =>
      c !== null && c !== undefined && c !== false
  );
  return {
    props: {
      ...(props ?? {}),
      ...(cs.length > 0 ? { children: cs.length === 1 ? cs[0] : cs } : {}),
    },
    type,
  };
}

function div(style: Style | null, ...children: Children[]): VNode {
  return h("div", style ? { style } : null, ...children);
}

const BG = "#0a0a0a" as const;
const FG = "#fafafa" as const;
const MUTED = "#a1a1aa" as const;
const SUBTLE = "#737373" as const;
const BORDER = "#27272a" as const;

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
  fontFamily: "JetBrains Mono",
  fontSize: 20,
  fontWeight: 500,
  letterSpacing: "0.15em",
} as const;

const footerStyle: Style = {
  color: SUBTLE,
  fontFamily: "JetBrains Mono",
  fontSize: 18,
} as const;

const outerStyle: Style = {
  background: BG,
  display: "flex",
  flexDirection: "column",
  height: 630,
  padding: 64,
  width: 1200,
} as const;

const centerStyle: Style = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  gap: 24,
  justifyContent: "center",
} as const;

const metaStyle: Style = {
  color: SUBTLE,
  display: "flex",
  fontFamily: "JetBrains Mono",
  fontSize: 14,
  gap: 8,
} as const;

const hrStyle: Style = {
  background: BORDER,
  height: 1,
  width: "100%",
} as const;

const titleStyle: Style = {
  color: FG,
  fontFamily: "IBM Plex Sans",
  fontWeight: 600,
  lineHeight: 1.1,
} as const;

const subtitleStyle: Style = {
  color: MUTED,
  fontFamily: "IBM Plex Sans",
  lineHeight: 1.4,
} as const;

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
      { gap: 24, marginTop: 32 },
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
      { gap: 24, marginTop: 32 },
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
      { gap: 24, marginTop: 32 },
      div(hrStyle),
      FlexRow(
        { alignItems: "center", justifyContent: "flex-end" },
        div(footerStyle, "michxymi.com")
      )
    )
  );
}
