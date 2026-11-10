# Security policy

## Reporting a vulnerability

**Do not open a public issue for a security vulnerability.**

Report privately to **seguranca@enois.ia.br**. Include:

- the affected version or commit;
- a minimal reproduction (a story, a snippet, a prop combination);
- the observed versus expected behaviour;
- the estimated impact — what a consumer of this package would expose.

You will get an initial triage within 5 business days. We work on a coordinated disclosure of up to
90 days, and the advisory ships with the fixing release. Good-faith research within scope is welcome.

## Scope

This package is a **rendering library**. It has no server, no database and no credentials. The
security surface is what a consumer inherits by rendering a view:

- **Injection through rendered content.** User content must render as React elements. Rich text goes
  through `RichText`, user links through `safeHref`, and user HTML only inside the sandboxed iframe
  (`patterns/html-frame`). A path that reaches `dangerouslySetInnerHTML` outside those is a
  vulnerability.
- **Unsafe URLs.** A link or media URL built from user input must pass through `safeHref` or
  `useAdapters().resolveMediaUrl`. A `javascript:` or `data:` URL that survives is a vulnerability.
- **Data leakage through props and stories.** A view must not log, persist or echo data it received.
  Stories and fixtures must never contain real personal data.
- **Supply chain.** A new dependency is part of the attack surface. It needs a justification in the
  PR, a maintained upstream and the same version range the front uses.

Out of scope: vulnerabilities in the consuming application's own code, in the backend, or in
third-party services the front talks to. Report those to the repository that owns them.

## What is already in force

- The repository is public and attackers read it. Commit messages and PR descriptions are neutral:
  they say *what* changed, never *how* a security flaw was fixed.
- Secrets never appear in code, logs, commits, PRs, stories or fixtures.
- A security or quality control is never disabled to make a build or a test pass.
- CI runs lint, typecheck, tests, build and a `dist` load check on every PR.

## References

OWASP ASVS 5.0 (level 2 as a minimum verification reference) and the OWASP Top 10. This is **not** a
certification and does not replace an independent security assessment.
