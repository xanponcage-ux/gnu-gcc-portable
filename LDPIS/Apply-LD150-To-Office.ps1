# Run in Windows PowerShell or a VS Code PowerShell terminal.
# git -C "D:\Office Work\Striver\gnu-gcc-portable" pull --ff-only origin main
# Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned -Force
# & "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1" -CheckOnly
# & "D:\Office Work\Striver\gnu-gcc-portable\LDPIS\Apply-LD150-To-Office.ps1"
# Transfers the six 2026-10-07 requests and the earlier LD150 update if needed.
# Checks patches on temporary copies first; preserves unrelated office edits.
# Does not stage, commit, push, or change either office repository's Git settings.
[CmdletBinding()]
param(
    [string]$OfficeRoot = "D:\LDP UAT MAY",
    [switch]$CheckOnly
)
$ErrorActionPreference = "Stop"
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "Git is not available. Run in the VS Code PowerShell terminal where Git works."
}
$bundle = Join-Path $PSScriptRoot "transfer\2026-10-07"
$manifest = Join-Path $bundle "manifest.json"
if (-not (Test-Path -LiteralPath $manifest)) { throw "Transfer bundle missing. Pull origin main first." }
$jobs = @(Get-Content -LiteralPath $manifest -Raw | ConvertFrom-Json)
$workDir = Join-Path ([System.IO.Path]::GetTempPath()) ("LDPIS-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $workDir | Out-Null
Write-Host "Preview files and backups: $workDir"
$prepared = @()

function Test-Patch([string]$Root, [string]$Patch, [switch]$Reverse) {
    $ErrorActionPreference = "Continue" # Expected nonzero checks must not terminate Windows PowerShell 5.1.
    if ($Reverse) { & git -C $Root apply --reverse --check --ignore-space-change -p3 $Patch 2>$null }
    else { & git -C $Root apply --check --ignore-space-change -p3 $Patch 2>$null }
    return ($LASTEXITCODE -eq 0)
}
function Apply-Patch([string]$Root, [string]$Patch) {
    & git -C $Root apply --ignore-space-change -p3 $Patch
    if ($LASTEXITCODE -ne 0) { throw "Patch failed on temporary copy: $Patch. Office files unchanged." }
}

# All application files are prepared and validated before ANY office file is written.
foreach ($job in $jobs) {
    $target = Join-Path $OfficeRoot $job.Project
    $targetFile = Join-Path $target $job.File
    if (-not (Test-Path -LiteralPath $targetFile -PathType Leaf)) { throw "Target file not found: $targetFile" }
    & git -C $target rev-parse --is-inside-work-tree | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Not a Git working tree: $target" }
    $stage = Join-Path $workDir ("stage\" + $job.Project)
    if (-not (Test-Path -LiteralPath $stage)) {
        New-Item -ItemType Directory -Path $stage -Force | Out-Null
        & git -C $stage init --quiet
        if ($LASTEXITCODE -ne 0) { throw "Cannot prepare temporary Git directory: $stage" }
    }
    $stageFile = Join-Path $stage $job.File
    New-Item -ItemType Directory -Path (Split-Path -Parent $stageFile) -Force | Out-Null
    $originalHash = (Get-FileHash -LiteralPath $targetFile -Algorithm SHA256).Hash
    Copy-Item -LiteralPath $targetFile -Destination $stageFile
    if ((Get-FileHash -LiteralPath $stageFile -Algorithm SHA256).Hash -ne $originalHash) {
        throw "Office file changed while preparing: $targetFile. Run again."
    }
    $patch = Join-Path $bundle $job.Patch
    if (Test-Patch $stage $patch -Reverse) {
        Write-Host "$($job.Project)/$($job.File): already applied."
        continue
    }
    if ($job.LegacyPatch) {
        $legacy = Join-Path $bundle $job.LegacyPatch
        if (Test-Patch $stage $legacy) { Apply-Patch $stage $legacy }
        elseif (-not (Test-Patch $stage $legacy -Reverse)) {
            throw "Earlier LD150 changes conflict in $targetFile. No office files changed. Review: $legacy"
        }
    }
    if (-not (Test-Patch $stage $patch)) {
        throw "Conflict in $targetFile. No office files changed. Merge the patch manually while preserving office edits: $patch"
    }
    Apply-Patch $stage $patch
    $backup = Join-Path $workDir ("backup\" + $job.Project + "\" + $job.File)
    $prepared += @{ TargetFile = $targetFile; StageFile = $stageFile; Backup = $backup; OriginalHash = $originalHash }
    Write-Host "$($job.Project)/$($job.File): check passed."
}
if ($CheckOnly) {
    Write-Host "Checks passed for all files. $($prepared.Count) file(s) need updating. No office files changed."
    return
}
# Recheck originals and back up every target before applying.
foreach ($item in $prepared) {
    if ((Get-FileHash -LiteralPath $item.TargetFile -Algorithm SHA256).Hash -ne $item.OriginalHash) {
        throw "Office file changed after preview: $($item.TargetFile). No files changed by this script. Run again."
    }
    New-Item -ItemType Directory -Path (Split-Path -Parent $item.Backup) -Force | Out-Null
    Copy-Item -LiteralPath $item.TargetFile -Destination $item.Backup
}
$written = @()
try {
    foreach ($item in $prepared) {
        $written += $item
        Copy-Item -LiteralPath $item.StageFile -Destination $item.TargetFile
        if ((Get-FileHash -LiteralPath $item.TargetFile -Algorithm SHA256).Hash -ne
            (Get-FileHash -LiteralPath $item.StageFile -Algorithm SHA256).Hash) {
            throw "Copy verification failed: $($item.TargetFile)"
        }
    }
} catch {
    $applyError = $_
    foreach ($item in $written) {
        try { Copy-Item -LiteralPath $item.Backup -Destination $item.TargetFile }
        catch { Write-Warning "Restore manually from $($item.Backup) to $($item.TargetFile)" }
    }
    throw "Transfer failed; attempted rollback. $applyError. Backups: $workDir"
}
Write-Host "Transfer complete: $($prepared.Count) file(s) updated. Review Source Control and test LD09-LD16."
Write-Host "Restart the backend for the receive-screen route. No Azure commit or push performed. Backups: $workDir"
