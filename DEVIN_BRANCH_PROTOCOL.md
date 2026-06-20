# Devin branch protocol

Use this repo only:

https://github.com/billionairebumblebee/cloak-sting-hackathon-2026

Hard rules:

- Do not push directly to `main`.
- Work on a feature branch named `devin/<task-slug>`.
- Do not copy from previous Cloak repos.
- Do not commit secrets or `.env` files.
- Run `npm run build` before opening a PR.
- Open a GitHub PR into `main` and include:
  - summary
  - changed files
  - tests run
  - screenshots/logs if relevant
  - known risks

## Recommended branches

- `devin/deepgram-voice-scam-path`
- `devin/devpost-table-demo-assets`
- `devin/qa-redteam-fixtures`

## Checkout pattern

```bash
git clone https://github.com/billionairebumblebee/cloak-sting-hackathon-2026.git
cd cloak-sting-hackathon-2026
git checkout -b devin/deepgram-voice-scam-path
npm install
# work...
npm run build
git add .
git commit -m "Add Deepgram voice scam path"
git push -u origin devin/deepgram-voice-scam-path
# open PR to main
```

## Merge protocol for Hermes

Hermes will keep working on `main` or its own branches. Before merging Devin PRs:

```bash
git fetch origin
git checkout main
git pull --ff-only origin main
gh pr checkout <PR_NUMBER>
npm run build
# inspect diff
git checkout main
gh pr merge <PR_NUMBER> --squash --delete-branch
npm run build
```
