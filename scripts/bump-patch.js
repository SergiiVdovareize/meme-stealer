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

  // Push commit and tag without re-triggering hooks
  console.log('Pushing commit and tags: git push --no-verify --follow-tags');
  execSync('git push --no-verify --follow-tags', { stdio: 'inherit' });

  console.log('Version bumped and tags pushed successfully.');
} catch (e) {
  console.error('Version bump failed:', e.message);
  process.exit(1);
}
