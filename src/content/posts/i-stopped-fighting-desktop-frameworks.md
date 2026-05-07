---
title: "I Stopped Fighting Desktop Frameworks. Here's What I Use Instead."
description: "Electron is bloated. Tauri wants you to learn Rust. Qt costs money. Here's how Pywebview let me stop compromising."
publishedAt: 2025-12-22
tags: ["python", "typescript", "react", "desktop", "electron", "tauri"]
featured: false
---

You want to build a desktop app. You've got a React frontend and some Python business logic. Should be simple.

It isn't. Welcome to the desktop framework hellscape, where every option demands you sacrifice something you actually care about.

## The Usual Suspects

[Electron](https://www.electronjs.org/) is the obvious choice. It's what VSCode uses, which is apparently supposed to make you feel better about shipping a 200MB "Hello World" that consumes RAM like it's training a language model.

The real pain isn't the resource usage - it's the developer experience. You write the same function definition three times just to call it from your frontend. The documentation is "fine." Packaging is its own adventure. And if you misconfigure context isolation, congratulations - you've just handed [every npm dependency in your tree](https://www.michxymi.com/blog/npm-dependencies-are-a-liability) the keys to your user's filesystem.

[Tauri](https://v2.tauri.app/) exists specifically because Electron is like this. It uses the system webview instead of bundling Chrome. It's leaner, faster, smaller. The catch? Your backend has to be Rust.

I'm sure Rust is great. I'm sure the borrow checker will make me a better person. I don't care. I have Python code that works. I'm not rewriting it.

[Qt](https://www.qt.io/) has been around forever. It powers [KDE](https://kde.org/). It's excellent for resource-constrained environments. The problem: you're writing UI in C++ or QML, a domain-specific language that gives you neither the power of C++ nor the ecosystem of JavaScript. Also there's a commercial license situation that I don't want to think about.

## What I Actually Need

Here's my requirements list. It's not complicated:

I want React for the frontend. I want Python for the backend. I want an interop layer that handles the type conversion so I don't have to. I want hot reloading during development. I want something that doesn't require me to learn a new language just to ship an app.

None of the major frameworks check all those boxes. So I stopped looking at major frameworks.

## Pywebview Does the Job

[Pywebview](https://pywebview.flowrl.com/) is a Python library that wraps a webview and lets you expose Python functions directly to JavaScript. That's it. That's the whole pitch.

You create a class with your API methods. You pass it to `create_window`. Your frontend can now call those methods. No three-layer function definitions. No Rust. No commercial license.

```python
class API:
    def get_data(self):
        return {"message": "This just works"}

webview.create_window("My App", "index.html", js_api=API())
webview.start()
```

For development, you point Pywebview at your Vite dev server. Hot reloading works. React DevTools work. Everything you're used to from web development... still works.

For production, you point it at a static `index.html`. A `--dev` flag in your main script handles the switch.

## The Project Structure

You end up with a monorepo. Backend folder for Python. Frontend folder for React. Two different ecosystems, two different package managers, no universal way to orchestrate them.

This is where [just](https://just.systems/) comes in. Think of it as Makefiles that don't make you want to quit programming.

```makefile
dev:
    npx concurrently --kill-others -s first \
        "cd frontend && pnpm run dev" \
        "npx wait-on http://localhost:5173 && backend/.venv/bin/myapp --dev"

uv ARG:
    cd backend && uv {{ARG}}

pnpm ARG:
    cd frontend && pnpm {{ARG}}
```

`just dev` starts both the Vite server and the Pywebview app. `concurrently` keeps them in sync - if one dies, the other dies too. `wait-on` prevents a race condition where Pywebview tries to load the frontend before Vite is ready.

`just uv sync` and `just pnpm install` save you from typing `cd backend &&` a hundred times a day. Small quality-of-life stuff that adds up.

## Packaging

I only needed `.deb` installers, so I wrote build scripts and called it a day. If you need cross-platform distribution, there are actual tools for this:

[Briefcase](https://briefcase.beeware.org/en/stable/) handles macOS, Windows, and Linux with one config. [PyOxidizer](https://pyoxidizer.readthedocs.io/en/stable/) produces self-contained executables. [Nuitka](https://nuitka.net/) compiles Python to C and spits out binaries.

I haven't tested all of these extensively. Your mileage will vary. But they exist, and they work with Pywebview.

## The Tradeoffs

Pywebview uses the system webview. On Linux that's WebKitGTK. On Windows it's Edge WebView2. On macOS it's WKWebView. In theory, this could mean CSS inconsistencies across platforms.

In practice? I haven't hit any. But I'm also not doing anything particularly exotic with my frontend. If you're pushing the boundaries of CSS, maybe test on all platforms before you commit to this approach.

This setup is ideal for SPA-style apps. If you need complex routing or heavy client-server communication, layer in [TanStack Router](https://tanstack.com/router/latest) and [TanStack Query](https://tanstack.com/query/latest) on the frontend, [Pydantic](https://docs.pydantic.dev/latest/) for validation on the backend.

## Why This Works for Me

I get to use the tools I already know. Python for business logic. React for UI. Modern tooling - [uv](https://docs.astral.sh/uv/), [ruff](https://docs.astral.sh/ruff/), [Vite](https://vite.dev/), [Tailwind](https://tailwindcss.com/) - all of it works.

The interop layer is invisible. I expose a Python method, I call it from JavaScript, I move on with my life.

No Rust. No QML. No three-layer function definitions. No commercial license.

Every framework involves compromise. This one just happens to compromise on things I don't care about.