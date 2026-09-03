$ErrorActionPreference = "Stop"

$ProjectPath = "D:\Projects\3watly"
$ExpectedOrigin = "https://github.com/ahmedamr022/3watly.git"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "       3WATLY - GITHUB UPDATE & PUSH        " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $ProjectPath

if (-not (Test-Path ".git")) {
Write-Host "ERROR: This is not a Git repository." -ForegroundColor Red
Read-Host "Press ENTER to exit"
exit 1
}

Write-Host "[OK] Git repository detected." -ForegroundColor Green

# Fix origin automatically

$originUrl = git remote get-url origin 2>$null

if (-not $originUrl) {
Write-Host "Origin does not exist. Adding correct origin..." -ForegroundColor Yellow
git remote add origin $ExpectedOrigin
}
elseif ($originUrl -ne $ExpectedOrigin) {
Write-Host ""
Write-Host "Current origin:" -ForegroundColor Yellow
Write-Host $originUrl
Write-Host ""
Write-Host "Changing origin to:" -ForegroundColor Cyan
Write-Host $ExpectedOrigin

```
git remote set-url origin $ExpectedOrigin
```

}

Write-Host ""
Write-Host "[OK] Correct origin:" -ForegroundColor Green
git remote get-url origin

# Detect current branch

$branch = git branch --show-current

if (-not $branch) {
Write-Host "ERROR: Could not detect current branch." -ForegroundColor Red
Read-Host "Press ENTER to exit"
exit 1
}

Write-Host ""
Write-Host "[OK] Current branch: $branch" -ForegroundColor Green

# Fetch latest changes

Write-Host ""
Write-Host "Fetching latest data from GitHub..." -ForegroundColor Cyan
git fetch origin

# Show changes

Write-Host ""
Write-Host "Current changes:" -ForegroundColor Cyan
git status --short

$confirm = Read-Host "Upload ALL these changes to GitHub? (y/n)"

if ($confirm -ne "y") {
Write-Host "Cancelled. Nothing was uploaded." -ForegroundColor Yellow
Read-Host "Press ENTER to exit"
exit 0
}

# Add all changes

Write-Host ""
Write-Host "Adding files..." -ForegroundColor Cyan
git add -A

# Check if anything is staged

$staged = git diff --cached --name-only

if ($staged) {

```
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
$commitMessage = "feat: latest 3watly updates - $timestamp"

Write-Host ""
Write-Host "Creating commit..." -ForegroundColor Cyan
git commit -m $commitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Commit failed." -ForegroundColor Red
    Read-Host "Press ENTER to exit"
    exit 1
}
```

}
else {
Write-Host ""
Write-Host "No new local changes to commit." -ForegroundColor Yellow
}

# Pull remote changes safely

Write-Host ""
Write-Host "Checking for remote updates..." -ForegroundColor Cyan

git pull origin $branch --rebase

if ($LASTEXITCODE -ne 0) {
Write-Host ""
Write-Host "ERROR: Remote changes caused a conflict." -ForegroundColor Red
Write-Host "Nothing was force-pushed." -ForegroundColor Yellow
Write-Host ""
Write-Host "Run: git status" -ForegroundColor White
Read-Host "Press ENTER to exit"
exit 1
}

# Push

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan

git push -u origin $branch

if ($LASTEXITCODE -eq 0) {
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "              SUCCESS!                      " -ForegroundColor Green
Write-Host "      FILES PUSHED TO 3WATLY GITHUB         " -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "https://github.com/ahmedamr022/3watly" -ForegroundColor Cyan
}
else {
Write-Host ""
Write-Host "ERROR: Push failed." -ForegroundColor Red
}

Write-Host ""
Read-Host "Press ENTER to exit"
