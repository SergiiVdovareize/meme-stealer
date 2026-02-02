#!/usr/bin/env node
const { execSync } = require('child_process');

// Skip in CI environments
if (process.env.CI || process.env.GITHUB_ACTIONS) {
  console.log('CI detected — skipping version bump.');
  process.exit(0);
}

try {
  // Use npm to bump patch and create a git tag (e.g., v0.1.6)
  console.log('Running: npm version patch --no-commit-hooks -m "chore(release): %s"');
  execSync('npm version patch --no-commit-hooks -m "chore(release): %s"', { stdio: 'inherit' });

  // NOTE: Do NOT push inside the pre-push hook to avoid race conditions.
  // Instead, exit non‑zero to abort the ongoing push so the user can re-run it and include the new commit & tag.
  console.log('\nVersion bumped. The pre-push has been aborted so you can push the new version commit and tag.')
  console.log('Run: git push --follow-tags')
  // Signal failure to abort the current push — the user should re-run `git push`.
  process.exit(1);
} catch (e) {
  console.error('Version bump failed:', e.message);
  process.exit(1);
}
