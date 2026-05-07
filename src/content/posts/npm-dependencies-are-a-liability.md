---
title: "Your NPM Dependencies Are a Liability. Here's the Fix."
description: "NPM's trust model is broken by design. Learn how PNPM's security features can protect your projects from supply chain attacks."
publishedAt: 2025-12-09
tags: ["security", "npm", "pnpm", "supply-chain"]
featured: false
---

Another week, another supply chain attack. You're reading this because some package you've never heard of - buried seventeen layers deep in your dependency tree - decided to phone home with your environment variables. Or maybe you just saw the headlines and felt that familiar dread.

Either way, welcome. I'm not here to lecture you about "security best practices" or pretend this is your fault. It isn't. The ecosystem is broken by design.

## The Problem You Already Know About

NPM operates on a trust model that would make a con artist blush. When you run `npm install`, here's what actually happens: your lockfile gets quietly rewritten with whatever patch versions the registry feels like serving you today. Those packages can run arbitrary shell scripts during installation. No sandbox. No warning. Just vibes.

Oh - and the code in the package doesn't have to match the source repo. That's a feature, apparently.

So you've got hundreds of dependencies you've never audited, updating themselves automatically, executing unknown code on your machine and your CI runners. The average attack window is measured in hours before NPM takes the package down. Cold comfort when your AWS credentials are already in someone else's hands.

## The Case for Dependency Cooldowns

Here's the uncomfortable math: most malicious packages get detected and reported within hours or days of publication. The window between "attacker publishes compromised package" and "NPM yanks it" is small. But if you're running `npm install` during that window, you lose.

The fix is stupidly simple. Don't install new packages immediately. Wait.

[William Woodruff](https://github.com/woodruffw) calls this a "dependency cooldown" - refusing to install any package version that's less than a few days old. It's not a perfect defense. A sufficiently patient attacker could wait out your cooldown period. But most supply chain attacks are opportunistic smash-and-grabs designed to harvest credentials before anyone notices. They rely on speed. A mandatory waiting period breaks that model.

NPM doesn't support this. PNPM does.

## PNPM Fixes This. Mostly.

I'm not going to pretend PNPM is a silver bullet. It's a package manager, not a miracle. But PNPM v10 shipped with features that NPM refuses to offer as defaults, and those features would have stopped most of the attacks you've been reading about.

A quick note: most of what I'm about to describe requires PNPM 10. Earlier versions don't have these capabilities. If you're on v9 or below, upgrade first.

```bash
npm install -g pnpm@latest-10
```

Now, the good stuff:

**`minimumReleaseAge`**: Tell PNPM to only install packages that have existed for at least a week. Set it to `10080` (minutes) and you've got a 7-day cooldown on every dependency in your tree. Most malicious packages don't survive that long.

**`onlyBuiltDependencies`**: Lifecycle scripts are disabled by default. All of them. If a package needs to run a postinstall script, you have to explicitly whitelist it. The attack surface for "malicious script runs on install" drops to near zero.

**`trustPolicy: no-downgrade`**: Blocks installation if a package's trust level has decreased. If a package was previously published by a trusted publisher but a new version suddenly has no provenance or weaker trust evidence - a red flag for account compromise - PNPM refuses to install it.

**Checksum verification**: PNPM verifies package integrity using checksums stored in the lockfile. If someone tries to swap out a package's contents after publication, the install fails.

These aren't experimental flags buried in documentation. They're project-level configuration that travels with your repo.


## The Migration

Switching isn't hard, but you can absolutely break your build if you do it wrong. The key is preserving your locked versions.

Don't run `pnpm install` on an existing project. Run `pnpm import` first. This reads your `package-lock.json` and generates `pnpm-lock.yaml` with identical resolved versions. Your build stays reproducible.

Then nuke the old stuff:

```bash
git rm --cached package-lock.json && \
rm -rf node_modules package-lock.json && \
echo "\npackage-lock.json\n" >> .gitignore
```

## The Configuration That Actually Matters

Create a `pnpm-workspace.yaml`:

```yaml
minimumReleaseAge: 10080
trustPolicy: no-downgrade
saveExact: true
engineStrict: true
```

That's your entire security configuration in one file. No more scattering settings across `.npmrc`, `package.json`, and whatever else. PNPM lets you put all registry and behavior settings in `pnpm-workspace.yaml` instead of `.npmrc` - which means your security posture is version-controlled and travels with the repo automatically.

What these do:

- `minimumReleaseAge: 10080` - 7 days in minutes. Packages must exist for a week before you'll install them.
- `trustPolicy: no-downgrade` - If a package's trust level drops between versions (previously from a trusted publisher, now missing provenance), installation fails. This catches compromised maintainer accounts.
- `saveExact: true` - Stops the deranged habit of adding `^` to every dependency. When you install `lodash@4.17.21`, you get exactly that in your `package.json` - not "whatever 4.x feels right today."
- `engineStrict: true` - Makes the `engines` field actually mean something. Wrong Node version? Install fails. No more "works on my machine."

## Locking Out the Old Package Managers

Your teammates will forget. They'll run `npm install` out of muscle memory and corrupt your `node_modules`. You can prevent this.

Add to your `package.json`:

```json
{
  "packageManager": "pnpm@10.23.0",
  "scripts": {
    "preinstall": "npx only-allow@1.2.1 pnpm"
  },
  "engines": {
    "node": ">=22",
    "npm": "please-use-pnpm",
    "yarn": "please-use-pnpm"
  }
}
```

The `preinstall` script will error out if anyone tries to use npm or yarn. The `engines` field is technically advisory, but with `engine-strict=true` in your `.npmrc`, it becomes mandatory.

Now run `pnpm install`.

## Handling Lifecycle Scripts

You'll probably see a message about ignored build scripts. Good. That's the point.

```
Ignored build scripts: electron, sqlite3, node-sass
```

Review each one. Most packages don't actually need their postinstall scripts to function. For the ones that do - anything using `node-gyp` for native bindings, typically - run `pnpm approve-builds` and whitelist them explicitly.

You're making a conscious decision about which packages get to execute arbitrary code on your machine. Novel concept.

## The Gotchas

PNPM doesn't flatten your `node_modules` like NPM does. This is actually correct behavior - you shouldn't be importing packages you didn't explicitly declare as dependencies. But if your codebase has been getting away with this for years, you'll hit "Module not found" errors.

These are called phantom dependencies. Your code imports a package that only exists because some other package pulled it in. Add the missing packages to your `package.json` and move on.

If you're dealing with a legacy project that's too broken to fix properly, you can force PNPM to mimic NPM's flat structure by adding `nodeLinker: hoisted` to your `pnpm-workspace.yaml`. This disables most of PNPM's correctness benefits, so treat it as a temporary bandage, not a solution.

Also update your scripts. `npm run build` becomes `pnpm run build`. `npx jest` becomes `pnpm exec jest`. Tedious, but straightforward.

## CI Changes

Your CI runners are the real target here. They have secrets. They have network access. They run `npm install` on every commit.

Use `--frozen-lockfile` in CI. Always. This ensures you're installing exactly what's in your lockfile, not whatever the registry decides is close enough.

```yaml
script:
  - pnpm install --frozen-lockfile
  - pnpm test
```

Cache your pnpm store between runs. Your builds will be faster and you'll stop hammering the registry.

Here's what that looks like in `gitlab-ci.yml` (or whatever CI flavor you're running)

```yaml
default:
  image: node:24
  before_script:
    - pnpm config set store-dir .pnpm-store
  cache:
    key:
      files:
        - pnpm-lock.yaml
    paths:
      - .pnpm-store/
```

## The Part Where I Tell You What to Do

Install PNPM locally. Migrate your projects. Update your CI pipelines. While you're in there, audit your CI secrets - you probably have credentials exposed to jobs that don't need them.

None of this is complicated. The complicated part was convincing yourself that NPM's defaults were acceptable. They aren't. They never were.

The next supply chain attack is already being planned. Whether it hits you is now a configuration choice.

## References

- [William Woodruff, "We should all be using dependency cooldowns" (2025)](https://blog.yossarian.net/2025/11/21/We-should-all-be-using-dependency-cooldowns)
- [PNPM Supply Chain Security Documentation](https://pnpm.io/supply-chain-security)
