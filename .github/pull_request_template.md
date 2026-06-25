## Summary

Describe the change and why it is needed.

## Related Issue

Closes #<issue-number> (or) Relates to #<issue-number>

## Target Branch

- [ ] This PR targets `develop`
- [ ] This PR targets `master` and is a release or hotfix PR

## Type of Change

- [ ] content
- [ ] feature
- [ ] fix
- [ ] refactor
- [ ] chore/build
- [ ] docs

## Screenshots / Videos

Include before/after for visible changes.

## Test Plan

Commands run locally:

```
yarn install --immutable
yarn verify:release-content
yarn build
```

Additional checks and scenarios covered:
-

## Release / Rollback Notes

Deployment impact, config changes, or rollback steps.

## Checklist

- [ ] Linked an issue and added a clear description
- [ ] Verified build locally or via CI
- [ ] Release content verification passes when public network/support copy changes
- [ ] Updated docs/content metadata where applicable
- [ ] No secrets or local environment files committed
- [ ] `./scripts/audit-public-artifacts.sh` passes when public artifacts or env defaults change
- [ ] No direct-to-`master` workflow is introduced
