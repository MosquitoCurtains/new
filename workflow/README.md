# Mosquito Curtains Workflow Scripts

Helper scripts for the multi-machine git workflow.

## Quick Start

### First Time Setup
```bash
chmod +x workflow/*.sh
./workflow/setup-branches.sh
```

### Daily Usage

| Script | Purpose |
|--------|---------|
| `./workflow/start-work.sh` | Begin working - pulls latest & syncs with dev |
| `./workflow/save-work.sh` | Save work - commits & pushes to your branch |
| `./workflow/merge-to-dev.sh` | Integrate - merges all work to dev & syncs back |
| `./workflow/deploy-to-main.sh` | Deploy - pushes dev to main (production) |

## Script Details

### `start-work.sh`
- Pulls your branch's latest changes
- Syncs with dev to avoid conflicts later
- Run this every time you start working

### `save-work.sh`
- Stages all changes
- Prompts for commit message (defaults to "WIP")
- Pushes to your remote branch
- Usage: `./workflow/save-work.sh` or `./workflow/save-work.sh "your message"`

### `merge-to-dev.sh`
- Merges all work branches (JVMacbookPro, DBMacbookAir) into dev
- Runs build test
- Syncs dev back to all work branches
- Run this before deploying or at integration points

### `deploy-to-main.sh`
- Merges dev into main
- Runs final build test
- Asks for confirmation before pushing
- Triggers Vercel auto-deployment

### `setup-branches.sh`
- Creates the branch structure (run once)
- Creates: dev, JVMacbookPro, DBMacbookAir
- Switches to JVMacbookPro when done

## Branch Structure

```
JVMacbookPro ──┐
               ├──→ dev ──→ main
DBMacbookAir ──┘
```

- **main**: Production (Vercel deploys from here)
- **dev**: Staging/integration branch
- **JVMacbookPro**: JV MacBook Pro work
- **DBMacbookAir**: DB MacBook Air work

## Troubleshooting

### Merge Conflicts
If you get merge conflicts:
1. Resolve the conflicts in your editor
2. `git add .`
3. `git commit`
4. Continue with the workflow

### Build Failures
If build fails during merge-to-dev or deploy:
1. Fix the errors
2. Commit the fix
3. Re-run the script

### Wrong Branch
Scripts will warn you if you're on the wrong branch. Switch with:
```bash
git checkout JVMacbookPro  # or DBMacbookAir
```
