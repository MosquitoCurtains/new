# Mosquito Curtains Git Workflow - Quick Reference

## 🎯 Branch Structure

```
JVMacbookPro (Machine 1) ──┐
                           ├──→ dev (staging) ──→ main (production → Vercel)
DBMacbookAir (Machine 2) ──┘
```

## 🚀 Common Commands

### Start Working
```bash
./workflow/start-work.sh
```

### Save Your Work
```bash
./workflow/save-work.sh
```

### Merge to Dev (Integration Point)
```bash
./workflow/merge-to-dev.sh
```

### Deploy to Production
```bash
./workflow/deploy-to-main.sh
```

## 📋 Manual Workflow

### Daily Work on JV MacBook Pro (Machine 1)
```bash
git checkout JVMacbookPro
git pull origin JVMacbookPro
# make changes
git add -A
git commit -m "your message"
git push origin JVMacbookPro
```

### Daily Work on DB MacBook Air (Machine 2)
```bash
git checkout DBMacbookAir
git pull origin DBMacbookAir
# make changes
git add -A
git commit -m "your message"
git push origin DBMacbookAir
```

### Integration to Dev
```bash
# Merge all branches to dev
git checkout dev
git pull origin dev
git merge JVMacbookPro
git merge DBMacbookAir
npm run build
git push origin dev

# Sync back to all branches
git checkout JVMacbookPro
git merge dev
git push origin JVMacbookPro

git checkout DBMacbookAir
git merge dev
git push origin DBMacbookAir
```

### Deploy to Production
```bash
git checkout main
git pull origin main
git merge dev --no-ff
npm run build
git push origin main
```

## 💡 Best Practices

1. **Commit often** - Every 15-30 minutes
2. **Pull before starting** - Always sync first
3. **Test before merging** - Run `npm run build`
4. **Clear messages** - Describe what and why
5. **WIP commits OK** - Better than losing work

## 🔧 Setup Status

- [ ] Dev branch created and pushed  
- [ ] JVMacbookPro branch created and synced  
- [ ] DBMacbookAir branch created and synced  
- [ ] Helper scripts installed and executable  

## 📚 Full Documentation

- Helper Scripts: `workflow/README.md`

## ⚠️ Important Notes

- **main** = Production (Vercel auto-deploys)
- **dev** = Staging (test here first)
- **JVMacbookPro** = JV MacBook Pro work
- **DBMacbookAir** = DB MacBook Air work

Always merge through dev before going to main!

## 🛠️ Initial Setup (Run Once)

To set up the branch structure, run:
```bash
./workflow/setup-branches.sh
```

This will create the dev, JVMacbookPro, and DBMacbookAir branches.
