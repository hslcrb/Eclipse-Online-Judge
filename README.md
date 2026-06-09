# Eclipse Platform Workspace

Welcome to the Eclipse Platform / SDK developer workspace. This directory contains a consolidated checkout of various sub-repositories and components of the [Eclipse Platform](https://github.com/eclipse-platform) organization.

> [!NOTE]
> This workspace has been detached from Git version control (all `.git` metadata folders have been recursively removed).

---

## Workspace Overview

The workspace contains the Eclipse SDK Platform codebase, organized as an aggregator along with its submodules/projects. It includes the build aggregator, core runtime/platform components, SWT (Standard Widget Toolkit), UI best practices, and website news/documentation.

Many repositories in the Eclipse ecosystem have been consolidated (merged) into larger monorepos to simplify build and development. Below is a detailed breakdown of the active and merged/obsolete directories in this workspace.

---

## Directory Structure & Component Status

### 🛠️ Active Repositories / Components

These directories are active and represent the current development areas of the Eclipse Platform.

| Directory Name | Description | Related Upstream Links |
| :--- | :--- | :--- |
| [`.eclipsefdn`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/.eclipsefdn) | **Eclipse Foundation Config Repo**: Configuration files related to the Eclipse Foundation and self-service GitHub organization management. | [Home](https://eclipse-platform.github.io/.eclipsefdn/) |
| [`.github`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/.github) | **Global Configuration**: Organization-wide GitHub templates, workflows, and contributing guidelines. | [Org GitHub](https://github.com/eclipse-platform) |
| [`eclipse.platform`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform) | **Eclipse Platform Project**: Core basis for the Eclipse IDE. Includes platform UI, resources, jobs scheduling/runtime, update manager, and recently merged modules. | [Repo](https://github.com/eclipse-platform/eclipse.platform) |
| [`eclipse.platform.images`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform.images) | **Archived Icon Repository**: Archive of SVG/PNG graphics and renderers. SVG assets are now embedded directly in the active bundles where they are used. | [Details](https://github.com/eclipse-platform/eclipse.platform.images) |
| [`eclipse.platform.releng.aggregator`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform.releng.aggregator) | **Build Aggregator**: The main aggregator repository used to build the Eclipse SDK (Framework, Java Development Tooling (JDT), and Plug-in Development Tooling (PDE)). | [Repo](https://github.com/eclipse-platform/eclipse.platform.releng.aggregator) |
| [`eclipse.platform.swt`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform.swt) | **Standard Widget Toolkit (SWT)**: Cross-platform GUI library for JVM desktop apps. Contains native implementations and LFS binary hooks. | [SWT Site](https://www.eclipse.org/swt/) |
| [`eclipse.platform.ui`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform.ui) | **Eclipse UI Project**: Workbench UI frameworks and basic building blocks for user interfaces. | [Repo](https://github.com/eclipse-platform/eclipse.platform.ui) |
| [`ui-best-practices`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/ui-best-practices) | **Eclipse UI Best Practices**: Design guidelines for creating consistent and high-quality Eclipse IDE/RCP plug-in user interfaces. | [Docs](https://eclipse-platform.github.io/ui-best-practices/) |
| [`www.eclipse.org-eclipse`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/www.eclipse.org-eclipse) | **New & Noteworthy Website**: "New and Noteworthy" descriptions for Eclipse SDK milestones and releases. | [News](https://www.eclipse.org/eclipse/news/) |

### 📦 Merged & Obsolete Repositories

The contents of these directories have been merged into other active components. They are kept for historical reference or older release branch maintenance.

| Obsolete Directory | Merged Into / Status |
| :--- | :--- |
| [`eclipse.platform.common`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform.common) | Merged into [`eclipse.platform.releng.aggregator`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform.releng.aggregator) |
| [`eclipse.platform.debug`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform.debug) | Merged into [`eclipse.platform`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform) |
| [`eclipse.platform.releng`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform.releng) | Merged into [`eclipse.platform.releng.aggregator`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform.releng.aggregator) |
| [`eclipse.platform.releng.buildtools`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform.releng.buildtools) | Archived and no longer active. |
| [`eclipse.platform.resources`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform.resources) | Merged into [`eclipse.platform`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform) |
| [`eclipse.platform.runtime`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform.runtime) | Merged into [`eclipse.platform`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform) |
| [`eclipse.platform.swt.binaries`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform.swt.binaries) | Merged into [`eclipse.platform.swt`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform.swt) using Git-LFS |
| [`eclipse.platform.team`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform.team) | Merged into [`eclipse.platform`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform) |
| [`eclipse.platform.text`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform.text) | Merged into [`eclipse.platform.ui`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform.ui) |
| [`eclipse.platform.ua`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform.ua) | Merged into [`eclipse.platform`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform) |
| [`eclipse.platform.ui.tools`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform.ui.tools) | Merged into [`eclipse.platform.ui`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/eclipse.platform.ui) |
| [`www.eclipse.org-eclipse-news`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/www.eclipse.org-eclipse-news) | Merged into [`www.eclipse.org-eclipse`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/www.eclipse.org-eclipse) |
| [`www.eclipse.org-swt`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/www.eclipse.org-swt) | Copied into [`www.eclipse.org-eclipse`](file:///home/rheehoselenovo2/개발프로젝트/Eclipse%20Online%20Judge/www.eclipse.org-eclipse) under the `swt` folder. |

---

## Build Instructions

To build the Eclipse SDK locally from the source files:

### Build Requirements
- **Java**: JDK 17 or higher
- **Maven**: Version 3.5.4 or higher
- (Recommended) Configuration of `toolchains.xml` and BREE libs as described in [Using BREE Libs Wiki](https://wiki.eclipse.org/Platform-releng/Platform_Build#Using_BREE_Libs).

### Build Commands
Navigate to the aggregator directory and run Maven:
```bash
cd eclipse.platform.releng.aggregator
mvn clean verify -DskipTests=true
```
> [!TIP]
> The `-DskipTests=true` flag is highly recommended as tests can take up to 10 hours to execute.

### Results Location
After a successful build, the compiled products can be found at:
`eclipse.platform.releng.aggregator/eclipse.platform.releng.tychoeclipsebuilder/eclipse.platform.repository/target/products`

---

## Documentation & Community
- **Issue Tracker**: Use GitHub to report bugs or request features: [Eclipse Platform Org GitHub Issues](https://github.com/eclipse-platform)
- **Mailing List**: Connect with developer community: [platform-dev Mailing List](https://accounts.eclipse.org/mailing-list/platform-dev)
- **Guidelines**: Read the [UI Guidelines](https://eclipse-platform.github.io/ui-best-practices) to maintain consistency in contributions.

## License
The codebase is licensed under the [Eclipse Public License (EPL) v2.0](https://www.eclipse.org/legal/epl-2.0/).
