local orgs = import 'vendor/otterdog-defaults/otterdog-defaults.libsonnet';

orgs.newOrg('eclipse.platform', 'eclipse-platform') {
  settings+: {
    blog: "https://eclipse.dev/eclipse/",
    description: "Eclipse Platform is a framework for rich client applications in Java, powering the Eclipse IDE and other toolsets",
    email: "platform-dev@eclipse.org",
    name: "Eclipse Platform",
    twitter_username: "EclipseJavaIDE",
    web_commit_signoff_required: false,
    workflows+: {
      default_workflow_permissions: "write",
    },
  },
  webhooks+: [
    orgs.newOrgWebhook('https://ci.eclipse.org/platform/github-webhook/') {
      content_type: "json",
      events+: [
        "pull_request",
        "push"
      ],
    },
  ],
  _repositories+:: [
    orgs.newRepo('.github') {
      delete_branch_on_merge: true,
      description: "Common contribution content for eclipse-platform repositories",
      has_discussions: true,
      has_projects: false,
      homepage: "https://eclipse.dev/eclipse/",
      topics+: [
        "eclipse"
      ],
      web_commit_signoff_required: false,
      workflows+: {
        default_workflow_permissions: "write",
      },
    },
    orgs.newRepo('eclipse.platform') {
      description: "Eclipse Platform - a comprehensive set of frameworks and common services that collectively provide a powerful software development infrastructure.",
      default_branch: "master",
      allow_squash_merge: false,
      delete_branch_on_merge: true,
      has_discussions: true,
      homepage: "https://eclipse.dev/eclipse/",
      topics+: [
        "eclipse",
        "java"
      ],
      web_commit_signoff_required: false,
      workflows+: {
        default_workflow_permissions: "write",
      },
      branch_protection_rules: [
        orgs.newBranchProtectionRule('master') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
        orgs.newBranchProtectionRule('R*maintenance') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
      ],
      secrets: [
        orgs.newRepoSecret('PLATFORM_BOT_PAT') {
          value: "pass:bots/eclipse.platform/github.com/token-hd5020",
        },
      ],
    },
    orgs.newRepo('eclipse.platform.common') {
      archived: true,
      default_branch: "master",
      delete_branch_on_merge: false,
      dependabot_alerts_enabled: false,
      has_projects: false,
      has_wiki: false,
      homepage: "https://eclipse.dev/eclipse/",
      web_commit_signoff_required: false,
      workflows+: {
        default_workflow_permissions: "write",
      },
      branch_protection_rules: [
        orgs.newBranchProtectionRule('master') {
          bypass_pull_request_allowances+: [
            "@eclipse-releng-bot"
          ],
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
        orgs.newBranchProtectionRule('R*maintenance') {
          bypass_pull_request_allowances+: [
            "@eclipse-releng-bot"
          ],
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
      ],
    },
    orgs.newRepo('eclipse.platform.debug') {
      archived: true,
      default_branch: "master",
      delete_branch_on_merge: false,
      description: "Eclipse Platform Debug functionality",
      has_projects: false,
      has_wiki: false,
      homepage: "https://eclipse.dev/eclipse/",
      topics+: [
        "debug",
        "eclipse",
        "ide",
        "java"
      ],
      web_commit_signoff_required: false,
      workflows+: {
        default_workflow_permissions: "write",
      },
      branch_protection_rules: [
        orgs.newBranchProtectionRule('master') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
        orgs.newBranchProtectionRule('R*maintenance') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
      ],
    },
    orgs.newRepo('eclipse.platform.images') {
      archived: true,
      default_branch: "master",
      allow_squash_merge: false,
      delete_branch_on_merge: true,
      dependabot_alerts_enabled: false,
      has_projects: false,
      has_wiki: false,
      web_commit_signoff_required: false,
      workflows+: {
        default_workflow_permissions: "write",
      },
      secrets: [
        orgs.newRepoSecret('ECLIPSE_GITLAB_API_TOKEN') {
          value: "pass:bots/eclipse.platform.releng/gitlab.eclipse.org/api-token",
        },
      ],
      branch_protection_rules: [
        orgs.newBranchProtectionRule('master') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
        orgs.newBranchProtectionRule('R*maintenance') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
      ],
    },
    orgs.newRepo('eclipse.platform.releng') {
      archived: true,
      default_branch: "master",
      delete_branch_on_merge: false,
      dependabot_alerts_enabled: false,
      has_discussions: true,
      has_projects: false,
      has_wiki: false,
      web_commit_signoff_required: false,
      workflows+: {
        default_workflow_permissions: "write",
      },
      branch_protection_rules: [
        orgs.newBranchProtectionRule('master') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
        orgs.newBranchProtectionRule('R*maintenance') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
      ],
    },
    orgs.newRepo('eclipse.platform.releng.aggregator') {
      description: "Aggregated repository from which Eclipse SDK is being build",
      allow_auto_merge: true,
      default_branch: "master",
      allow_squash_merge: false,
      delete_branch_on_merge: true,
      dependabot_alerts_enabled: false,
      has_discussions: true,
      has_projects: false,
      homepage: "https://eclipse.dev/eclipse/",
      topics+: [
        "eclipse",
        "ide",
        "java"
      ],
      web_commit_signoff_required: false,
      workflows+: {
        default_workflow_permissions: "write",
      },
      secrets: [
        orgs.newRepoSecret('ECLIPSE_GITLAB_API_TOKEN') {
          value: "pass:bots/eclipse.platform.releng/gitlab.eclipse.org/api-token",
        },
        orgs.newRepoSecret('RELENG_BOT_PAT') {
          value: "pass:bots/eclipse.platform.releng/github.com/token-hd4925",
        },
        orgs.newRepoSecret('PLATFORM_BOT_PAT') {
          value: "pass:bots/eclipse.platform/github.com/token-hd5020",
        },
      ],
      branch_protection_rules: [
        orgs.newBranchProtectionRule('master') {
          bypass_pull_request_allowances+: [
            "@eclipse-releng-bot"
          ],
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
        orgs.newBranchProtectionRule('R*maintenance') {
          bypass_pull_request_allowances+: [
            "@eclipse-releng-bot"
          ],
          required_approving_review_count: 1,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
      ],
    },
    orgs.newRepo('eclipse.platform.releng.buildtools') {
      archived: true,
      default_branch: "master",
      allow_squash_merge: false,
      delete_branch_on_merge: true,
      dependabot_alerts_enabled: false,
      has_projects: false,
      has_wiki: false,
      web_commit_signoff_required: false,
      workflows+: {
        default_workflow_permissions: "write",
      },
      branch_protection_rules: [
        orgs.newBranchProtectionRule('master') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
        orgs.newBranchProtectionRule('R*maintenance') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
      ],
    },
    orgs.newRepo('eclipse.platform.resources') {
      archived: true,
      default_branch: "master",
      delete_branch_on_merge: false,
      has_projects: false,
      has_wiki: false,
      web_commit_signoff_required: false,
      workflows+: {
        default_workflow_permissions: "write",
      },
      branch_protection_rules: [
        orgs.newBranchProtectionRule('master') {
          bypass_pull_request_allowances+: [
            "@eclipse-releng-bot"
          ],
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
        orgs.newBranchProtectionRule('R*maintenance') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
      ],
    },
    orgs.newRepo('eclipse.platform.runtime') {
      archived: true,
      default_branch: "master",
      delete_branch_on_merge: false,
      has_projects: false,
      has_wiki: false,
      web_commit_signoff_required: false,
      workflows+: {
        default_workflow_permissions: "write",
      },
      branch_protection_rules: [
        orgs.newBranchProtectionRule('master') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
        orgs.newBranchProtectionRule('R*maintenance') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
      ],
    },
    orgs.newRepo('eclipse.platform.swt') {
      default_branch: "master",
      allow_squash_merge: false,
      delete_branch_on_merge: true,
      description: "Eclipse SWT - The Standard Widget Toolkit",
      has_discussions: true,
      has_projects: false,
      homepage: "https://eclipse.dev/eclipse/swt/",
      topics+: [
        "cross-platform-gui",
        "eclipse",
        "java",
        "swt",
        "ui",
        "gui",
      ],
      web_commit_signoff_required: false,
      workflows+: {
        default_workflow_permissions: "write",
      },
      webhooks: [
        orgs.newRepoWebhook('https://ci.eclipse.org/releng/github-webhook/') {
          events+: [
            "pull_request",
            "push"
          ],
        },
      ],
      secrets: [
        orgs.newRepoSecret('GIST_TOKEN') {
          value: "********",
        },
        orgs.newRepoSecret('PLATFORM_BOT_PAT') {
          value: "pass:bots/eclipse.platform/github.com/token-hd5020",
        },
      ],
      branch_protection_rules: [
        orgs.newBranchProtectionRule('master') {
          bypass_pull_request_allowances+: [
            "@eclipse-releng-bot"
          ],
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
        orgs.newBranchProtectionRule('R*maintenance') {
          bypass_pull_request_allowances+: [
            "@eclipse-releng-bot"
          ],
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
      ],
    },
    orgs.newRepo('eclipse.platform.swt.binaries') {
      archived: true,
      default_branch: "master",
      delete_branch_on_merge: false,
      description: "Eclipse SWT",
      has_projects: false,
      has_wiki: false,
      homepage: "https://eclipse.dev/eclipse/swt/",
      web_commit_signoff_required: false,
      workflows+: {
        default_workflow_permissions: "write",
      },
      branch_protection_rules: [
        orgs.newBranchProtectionRule('master') {
          bypass_pull_request_allowances+: [
            "@eclipse-releng-bot"
          ],
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
        orgs.newBranchProtectionRule('R*maintenance') {
          bypass_pull_request_allowances+: [
            "@eclipse-releng-bot"
          ],
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
      ],
    },
    orgs.newRepo('eclipse.platform.team') {
      archived: true,
      default_branch: "master",
      delete_branch_on_merge: false,
      has_projects: false,
      has_wiki: false,
      web_commit_signoff_required: false,
      workflows+: {
        default_workflow_permissions: "write",
      },
      branch_protection_rules: [
        orgs.newBranchProtectionRule('master') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
        orgs.newBranchProtectionRule('R*maintenance') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
      ],
    },
    orgs.newRepo('eclipse.platform.text') {
      archived: true,
      default_branch: "master",
      delete_branch_on_merge: false,
      has_projects: false,
      has_wiki: false,
      private_vulnerability_reporting_enabled: true,
      web_commit_signoff_required: false,
      workflows+: {
        default_workflow_permissions: "write",
      },
      branch_protection_rules: [
        orgs.newBranchProtectionRule('master') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
        orgs.newBranchProtectionRule('R*maintenance') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
      ],
    },
    orgs.newRepo('eclipse.platform.ua') {
      archived: true,
      default_branch: "master",
      delete_branch_on_merge: false,
      dependabot_alerts_enabled: false,
      has_projects: false,
      has_wiki: false,
      web_commit_signoff_required: false,
      workflows+: {
        default_workflow_permissions: "write",
      },
      branch_protection_rules: [
        orgs.newBranchProtectionRule('master') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
        orgs.newBranchProtectionRule('R*maintenance') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
      ],
    },
    orgs.newRepo('eclipse.platform.ui') {
      description: "Eclipse Platform UI - a comprehensive set of frameworks and common services that collectively provide a powerful software development infrastructure.",
      allow_auto_merge: true,
      default_branch: "master",
      allow_squash_merge: false,
      delete_branch_on_merge: true,
      has_discussions: true,
      has_projects: false,
      homepage: "https://eclipse.dev/eclipse/",
      topics+: [
        "eclipse",
        "gui",
        "java",
        "osgi",
        "rcp",
        "swt"
      ],
      web_commit_signoff_required: false,
      workflows+: {
        default_workflow_permissions: "write",
      },
      branch_protection_rules: [
        orgs.newBranchProtectionRule('master') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
        orgs.newBranchProtectionRule('R*maintenance') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
      ],
      secrets: [
        orgs.newRepoSecret('PLATFORM_BOT_PAT') {
          value: "pass:bots/eclipse.platform/github.com/token-hd5020",
        },
      ],
    },
    orgs.newRepo('eclipse.platform.ui.tools') {
      archived: true,
      default_branch: "master",
      delete_branch_on_merge: false,
      has_projects: false,
      has_wiki: false,
      web_commit_signoff_required: false,
      workflows+: {
        default_workflow_permissions: "write",
      },
      branch_protection_rules: [
        orgs.newBranchProtectionRule('master') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
        orgs.newBranchProtectionRule('R*maintenance') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
      ],
    },
    orgs.newRepo('ui-best-practices') {
      default_branch: "main",
      allow_squash_merge: false,
      delete_branch_on_merge: true,
      description: "UI Best Practices for the Eclipse IDE",
      gh_pages_build_type: "legacy",
      gh_pages_source_branch: "gh-pages",
      gh_pages_source_path: "/",
      has_discussions: true,
      homepage: "https://eclipse-platform.github.io/ui-best-practices/",
      web_commit_signoff_required: false,
      workflows+: {
        default_workflow_permissions: "write",
      },
      environments: [
        orgs.newEnvironment('github-pages') {
          branch_policies+: [
            "gh-pages"
          ],
          deployment_branch_policy: "selected",
        },
      ],
    },
    orgs.newRepo('www.eclipse.org-eclipse') {
      default_branch: "master",
      allow_squash_merge: false,
      delete_branch_on_merge: true,
      has_projects: false,
      has_wiki: false,
      web_commit_signoff_required: false,
      workflows+: {
        default_workflow_permissions: "read",
      },
      branch_protection_rules: [
        orgs.newBranchProtectionRule('master') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
      ],
    },
    orgs.newRepo('www.eclipse.org-eclipse-news') {
      archived: true,
      default_branch: "master",
      delete_branch_on_merge: false,
      has_projects: false,
      has_wiki: false,
      web_commit_signoff_required: false,
      workflows+: {
        enabled: false,
      },
      branch_protection_rules: [
        orgs.newBranchProtectionRule('master') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
      ],
    },
    orgs.newRepo('www.eclipse.org-swt') {
      archived: true,
      default_branch: "master",
      delete_branch_on_merge: false,
      web_commit_signoff_required: false,
      workflows+: {
        enabled: false,
      },
      branch_protection_rules: [
        orgs.newBranchProtectionRule('master') {
          required_approving_review_count: 0,
          requires_status_checks: false,
          requires_strict_status_checks: true,
        },
      ],
    },
  ],
}
