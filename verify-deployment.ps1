# Deployment Verification Script for Cloudflare Pages
# Run this in PowerShell to verify everything is ready

Write-Host "🔍 Cloudflare Pages Deployment Verification" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js version
Write-Host "✓ Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "  Node.js: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Check if on correct branch
Write-Host "✓ Checking Git branch..." -ForegroundColor Yellow
$currentBranch = git branch --show-current
if ($currentBranch -eq "claude/fix-pages-file-size-limit-011CUjSNYuFJTeHkw7LsMf8Q") {
    Write-Host "  ✓ On correct branch: $currentBranch" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Wrong branch: $currentBranch" -ForegroundColor Red
    Write-Host "  Run: git checkout claude/fix-pages-file-size-limit-011CUjSNYuFJTeHkw7LsMf8Q" -ForegroundColor Yellow
}
Write-Host ""

# Check for key files
Write-Host "✓ Checking for required files..." -ForegroundColor Yellow
$requiredFiles = @(
    "next.config.js",
    "wrangler.toml",
    "package.json",
    "app/layout.tsx",
    "app/page.tsx"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file missing" -ForegroundColor Red
        $allFilesExist = $false
    }
}
Write-Host ""

# Check if node_modules exists
Write-Host "✓ Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "  ✓ node_modules exists" -ForegroundColor Green
} else {
    Write-Host "  ⚠ node_modules not found" -ForegroundColor Yellow
    Write-Host "  Run: npm install" -ForegroundColor Cyan
}
Write-Host ""

# Check if build output exists
Write-Host "✓ Checking build output..." -ForegroundColor Yellow
if (Test-Path "out") {
    $outSize = (Get-ChildItem -Path "out" -Recurse | Measure-Object -Property Length -Sum).Sum
    $outSizeMB = [math]::Round($outSize / 1MB, 2)

    if ($outSizeMB -lt 25) {
        Write-Host "  ✓ Build output exists: ${outSizeMB}MB (under 25MB limit)" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Build output too large: ${outSizeMB}MB (exceeds 25MB limit)" -ForegroundColor Red
    }
} else {
    Write-Host "  ⚠ Build output not found" -ForegroundColor Yellow
    Write-Host "  Run: npm run build" -ForegroundColor Cyan
}
Write-Host ""

# Final status
Write-Host "==========================================" -ForegroundColor Cyan
if ($allFilesExist) {
    Write-Host "🎉 READY TO DEPLOY!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. npm run build (if you haven't already)" -ForegroundColor White
    Write-Host "2. npx wrangler pages deploy out --project-name=digital-democracy-iraq" -ForegroundColor White
} else {
    Write-Host "⚠ Some files are missing. Please check above." -ForegroundColor Red
}
Write-Host ""
