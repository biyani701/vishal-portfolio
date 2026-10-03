# domain-hub Specification

## Purpose
Defines what `biyani.xyz` presents: a front door to the sites and experiments under the domain, led by the portfolio. It also covers how the hub is published from the monorepo, how its statuses stay consistent with the portfolio, and the confidentiality rules it shares with the portfolio.

## Requirements

### Requirement: Hub content
`biyani.xyz` SHALL present, in this order (`www.biyani.xyz` SHALL redirect to it):
1. The owner's name, with a single positioning line consistent with the portfolio's positioning. The portfolio (`https://vishal.biyani.xyz`) SHALL be the primary call to action.
2. **Sites**: the portfolio, the blog (`blog.biyani.xyz`) and the knowledge base (`kb.biyani.xyz`). Each shows a one-line purpose and a status.
3. **Labs**: older experiments served at `biyani.xyz/<repo>`, each with a one-line description. Labs SHALL be visually secondary to Sites.
4. A footer linking the portfolio's contact page.

A site that isn't live yet SHALL show "In progress" and SHALL NOT link to its address. The hub SHALL NOT list the previous portfolio (`/portfolio/`) or any project whose page returns an error.

#### Scenario: Portfolio leads
- **WHEN** a visitor opens `https://biyani.xyz` on any viewport
- **THEN** the name, positioning line and a link to `https://vishal.biyani.xyz` are visible without scrolling, before any Labs entry

#### Scenario: Site not live yet
- **WHEN** the knowledge base is not live
- **THEN** its entry says "In progress" and contains no link to `kb.biyani.xyz`

#### Scenario: Labs entry
- **WHEN** a visitor follows a Labs entry
- **THEN** it opens `https://biyani.xyz/<repo>/`, and that page responds with 200 at the time the hub is built and tested

### Requirement: Consistency with the portfolio
The live or in-progress status of the blog and knowledge base on the hub SHALL match the `site.live` flags in the portfolio's content records. The build SHALL fail when they differ.

#### Scenario: Blog goes live
- **WHEN** `blog-platform.md` sets `site.live: true` and the hub still shows the blog as in progress
- **THEN** the hub's tests fail, naming the site and both values

### Requirement: Static, accessible and on-brand
The hub SHALL be served as prerendered HTML that is complete without JavaScript. Scripts SHALL be limited to the theme: applying it before first paint and a light/dark toggle that appears only when JavaScript runs. It SHALL use the shared design tokens and fonts, follow the light or dark theme the visitor's system prefers unless they choose one with the toggle, give every interactive target at least 44×44 px with the default focus outline, and pass an automated axe check with no violations in both themes.

#### Scenario: No JavaScript
- **WHEN** the hub is loaded with JavaScript disabled
- **THEN** every section and link is present and usable

#### Scenario: Accessibility
- **WHEN** the axe check runs on the hub at phone and desktop widths, in light and dark themes
- **THEN** it reports no violations

### Requirement: Publishing
On every push to `main` that changes the hub or its shared packages, CI SHALL lint, test and build the hub. When those pass, it SHALL publish the build to the `gh-pages` branch of `biyani701/biyani701.github.io`:
- as a single commit that replaces the branch's previous content and history
- with a `CNAME` file containing `biyani.xyz`
- with a `.nojekyll` file

Pull requests SHALL run the checks but SHALL NOT publish. A production smoke test SHALL then confirm that `https://biyani.xyz` serves the new build and that every Labs link responds.

#### Scenario: Publish from main
- **WHEN** a hub change is merged to `main`
- **THEN** the user-site repo's `gh-pages` branch holds exactly one commit with the new build and `CNAME`, and the smoke test passes against `https://biyani.xyz`

#### Scenario: Pull request
- **WHEN** a pull request changes `apps/hub`
- **THEN** the hub checks run and nothing is published

#### Scenario: Project pages unaffected
- **WHEN** the hub is published
- **THEN** `https://biyani.xyz/click-tracker/` and the other Labs project pages still respond

### Requirement: Shared confidentiality guard
The hub's content and built HTML SHALL pass the same confidentiality guard as the portfolio, and the build SHALL fail, naming the file and term, when they don't.

#### Scenario: Guarded hub content
- **WHEN** a hub content record contains a term the guard rejects
- **THEN** the hub build fails and names the file and the term

### Requirement: Retire the old site's source
After the hub's first publish, the `main` branch of `biyani701/biyani701.github.io` SHALL contain only a README stating that the site is built from `biyani701/vishal-portfolio` (`apps/hub`). The old React source SHALL no longer be on that branch.

#### Scenario: Old source removed
- **WHEN** a visitor browses `biyani701/biyani701.github.io` on GitHub
- **THEN** `main` shows only the README pointing to this repository
