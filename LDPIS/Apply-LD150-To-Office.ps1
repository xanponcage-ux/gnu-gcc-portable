# LD150 transfer: run in Windows PowerShell or a VS Code PowerShell terminal.
# First update the rough repo:
# git -C "D:\Office Work\Striver\gnu-gcc-portable" pull --ff-only origin main
# Then run:
# & "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1"
#
# Applies ONLY the two application-file changes from commit 5e6a14d.
# Checks both patches first. Does not commit, push, or copy .git/node_modules.
# Optional preview:
# & "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1" -CheckOnly
[CmdletBinding()]
param(
    [string]$OfficeRoot = "D:\LDP UAT MAY",
    [switch]$CheckOnly
)

$ErrorActionPreference = "Stop"
$sourceRepo = Split-Path -Parent $PSScriptRoot
$changeCommit = "5e6a14d7776af1c4e96e402e6daa158cb878a363"
$baseCommit = "ebca5d8398247a7bf4b0ae0e0959300ce045703e"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "Git is not available. Run this in the VS Code PowerShell terminal where Git works."
}

& git -C $sourceRepo cat-file -e "$changeCommit^{commit}"
if ($LASTEXITCODE -ne 0) {
    throw "The LD150 commit is missing locally. Pull origin main in the rough repo, then run again."
}

$workDir = Join-Path ([System.IO.Path]::GetTempPath()) ("LD150-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $workDir | Out-Null
Write-Host "Patches and backups: $workDir"

$jobs = @(
    @{ Project = "LDPIS-Backend"; File = "src/repository/LD15S001Query.ts" },
    @{ Project = "LDPIS-Frontend"; File = "src/views/Mill/LD15S001.jsx" }
)

# Prepare and check every target before modifying either application file.
foreach ($job in $jobs) {
    $target = Join-Path $OfficeRoot $job.Project
    $targetFile = Join-Path $target $job.File
    if (-not (Test-Path -LiteralPath $targetFile -PathType Leaf)) {
        throw "Target file not found: $targetFile"
    }
    & git -C $target rev-parse --is-inside-work-tree
    if ($LASTEXITCODE -ne 0) { throw "Not a Git working tree: $target" }

    $patch = Join-Path $workDir ($job.Project + ".patch")
    $repoFile = "LDPIS/" + $job.Project + "/" + $job.File
    & git -C $sourceRepo diff --binary "--output=$patch" $baseCommit $changeCommit -- $repoFile
    if ($LASTEXITCODE -ne 0) { throw "Could not generate patch for $repoFile" }
    if ((Get-Item -LiteralPath $patch).Length -eq 0) { throw "Generated patch is empty: $patch" }

    $job.Target = $target
    $job.Patch = $patch
    $job.TargetFile = $targetFile
    $job.Backup = Join-Path $workDir ($job.Project + "-" + (Split-Path -Leaf $targetFile) + ".bak")
    $job.Skip = $false

    & git -C $target apply --check -p3 $patch
    if ($LASTEXITCODE -ne 0) {
        & git -C $target apply --reverse --check -p3 $patch
        if ($LASTEXITCODE -eq 0) {
            $job.Skip = $true
            Write-Host "$($job.Project): changes already applied; skipping."
        } else {
            throw "Patch conflicts in $target. No files have been changed. Ask Roo to merge $patch into $target while preserving existing office changes."
        }
    }
}

if ($CheckOnly) {
    Write-Host "Checks passed. No files changed. Run without -CheckOnly to apply."
    return
}

foreach ($job in $jobs) {
    if ($job.Skip) { continue }
    Copy-Item -LiteralPath $job.TargetFile -Destination $job.Backup
    & git -C $job.Target apply -p3 $job.Patch
    if ($LASTEXITCODE -ne 0) {
        throw "Apply failed in $($job.Target). Check Git status; an earlier project may already be applied. Backups: $workDir"
    }
    Write-Host "$($job.Project): applied."
}

Write-Host "Transfer complete. Review Source Control in both office projects and test LD150."
Write-Host "No Azure commit or push was performed. Backups: $workDir"
