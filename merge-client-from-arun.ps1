<#
merge-client-from-arun.ps1

Usage:
  1) Open PowerShell in the repository root (where .git lives).
  2) Run: .\merge-client-from-arun.ps1 [-SourceBranch arun] [-Remote origin] [-Push]

What it does:
  - Ensures working tree is clean (no uncommitted changes).
  - Fetches the remote source branch (default: origin/arun).
  - Copies the exact content of the `client/` folder from the source branch into the current branch (adds/updates).
  - Detects files removed from `client/` on the source branch and removes them in the working tree (git rm).
  - Commits the result and optionally pushes to the current branch's remote.

Notes:
  - This script makes a commit on your current branch. Make sure you want that.
  - If you prefer a dry-run, run with `-WhatIf` (PowerShell builtin) on the git commands or inspect the changes before committing.
#>
param(
    [string]$SourceBranch = "arun",
    [string]$Remote = "origin",
    [switch]$Push
)

function Fail($msg) {
    Write-Host "ERROR: $msg" -ForegroundColor Red
    exit 1
}

# 1) Validate we are in a git repo
if (-not (Test-Path ".git")) {
    Fail "This script must be run from the repository root (where .git is)."
}

# 2) Ensure working tree is clean
$porcelain = & git status --porcelain
if ($LASTEXITCODE -ne 0) { Fail "git not available or error running git status." }
if ($porcelain -ne "") {
    Write-Host "Working tree is dirty. Please commit or stash changes before running this script." -ForegroundColor Yellow
    Write-Host "git status --porcelain output:`n$porcelain"
    exit 2
}

# 3) Determine current branch
$currentBranch = (& git rev-parse --abbrev-ref HEAD).Trim()
if ($LASTEXITCODE -ne 0 -or -not $currentBranch) { Fail "Failed to determine current branch." }
Write-Host "Current branch: $currentBranch"

# 4) Fetch source branch from remote
Write-Host "Fetching $Remote/$SourceBranch..."
& git fetch $Remote $SourceBranch
if ($LASTEXITCODE -ne 0) { Fail "Failed to fetch $Remote/$SourceBranch." }

# 5) Build file lists for client/ in source and HEAD
$tmp = [System.IO.Path]::GetTempPath()
$arunList = Join-Path $tmp "arun_client_files.txt"
$headList = Join-Path $tmp "head_client_files.txt"

# get file list from source branch
$arunFiles = & git ls-tree -r --name-only "$Remote/$SourceBranch" -- client
if ($LASTEXITCODE -ne 0) { Fail "Failed to list files for $Remote/$SourceBranch" }
$arunFiles | Sort-Object | Out-File -Encoding utf8 -FilePath $arunList

# get file list from HEAD
$headFiles = & git ls-tree -r --name-only HEAD -- client
if ($LASTEXITCODE -ne 0) { Fail "Failed to list files for HEAD" }
$headFiles | Sort-Object | Out-File -Encoding utf8 -FilePath $headList

# 6) Compute files that exist in HEAD but not in arun (to delete)
$headSet = @()
if (Test-Path $headList) { $headSet = Get-Content $headList | Where-Object { $_ -ne "" } }
$arunSet = @()
if (Test-Path $arunList) { $arunSet = Get-Content $arunList | Where-Object { $_ -ne "" } }

$toDelete = $headSet | Where-Object { -not ($arunSet -contains $_) }

# 7) Checkout client/ from source branch into working tree (this will add/update files)
Write-Host "Checking out client/ from $Remote/$SourceBranch into working tree..."
& git checkout "$Remote/$SourceBranch" -- client
if ($LASTEXITCODE -ne 0) { Fail "git checkout of client/ from $Remote/$SourceBranch failed." }

# 8) Stage deletions if any
if ($toDelete.Count -gt 0) {
    Write-Host "Removing files deleted on $SourceBranch..." -ForegroundColor Yellow
    foreach ($f in $toDelete) {
        Write-Host "git rm --ignore-unmatch $f"
        & git rm --ignore-unmatch -- "$f"
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Warning: git rm failed on $f (continuing)" -ForegroundColor Yellow
        }
    }
}

# 9) Stage additions/updates
Write-Host "Staging changes under client/..."
& git add --all -- client
if ($LASTEXITCODE -ne 0) { Fail "git add failed." }

# 10) If there are changes, commit and optionally push
$changes = & git status --porcelain
if ($changes -eq "") {
    Write-Host "No changes to commit after syncing client/. Nothing to do." -ForegroundColor Green
    exit 0
}

Write-Host "Committing changes..."
& git commit -m "Sync client/ from $Remote/$SourceBranch (automated)"
if ($LASTEXITCODE -ne 0) { Fail "git commit failed." }

if ($Push) {
    Write-Host "Pushing $currentBranch to $Remote..."
    & git push $Remote $currentBranch
    if ($LASTEXITCODE -ne 0) { Fail "git push failed." }
}

Write-Host "Done. Synced client/ from $Remote/$SourceBranch into $currentBranch." -ForegroundColor Green
