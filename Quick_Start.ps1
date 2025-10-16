# HAMLET PROJECT - ALL-IN-ONE QUICK START
# Save this file as: Quick_Start.ps1 in E:\HamletUnified\

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$rootPath = "E:\HamletUnified"

Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "HAMLET PROJECT - QUICK START" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Find master file
$masterFile = Get-ChildItem "$rootPath\full_consolidation\candidates\master\MASTER_CANDIDATES_*.csv" | Select-Object -First 1

if (-not $masterFile) {
    Write-Host "ERROR: Master file not found!" -ForegroundColor Red
    Write-Host "Looking in: $rootPath\full_consolidation\candidates\master\" -ForegroundColor Yellow
    exit 1
}

Write-Host "[1/4] Found master file: $($masterFile.Name)" -ForegroundColor Green

# Load data
Write-Host "[2/4] Loading candidates..." -ForegroundColor Yellow
$candidates = Import-Csv $masterFile.FullName -Encoding UTF8
$total = $candidates.Count
Write-Host "      Loaded: $total candidates" -ForegroundColor White

# Analyze quality
Write-Host "[3/4] Analyzing data quality..." -ForegroundColor Yellow
$suspiciousPatterns = @("winds", "dryness", "kind, kind", "young man", "secrets", "flame", "egg", "jealous")
$issueCount = 0

foreach ($candidate in $candidates) {
    $fullName = $candidate.'Candidate''s full name'
    foreach ($pattern in $suspiciousPatterns) {
        if ($fullName -like "*$pattern*") {
            $issueCount++
            break
        }
    }
}

$qualityScore = [math]::Round(($total - $issueCount)/$total*100, 1)
Write-Host "      Quality Score: $qualityScore%" -ForegroundColor $(if($qualityScore -gt 90){"Green"}else{"Yellow"})
Write-Host "      Needs Review: $issueCount candidates" -ForegroundColor Yellow

# Create cleaned file
Write-Host "[4/4] Creating cleaned dataset..." -ForegroundColor Yellow
$cleanedPath = "$rootPath\full_consolidation\candidates\master\CLEANED_CANDIDATES_$timestamp.csv"

$cleanedData = $candidates | ForEach-Object {
    $needsReview = $false
    $fullName = $_.'Candidate''s full name'
    foreach ($pattern in $suspiciousPatterns) {
        if ($fullName -like "*$pattern*") {
            $needsReview = $true
            break
        }
    }
    
    [PSCustomObject]@{
        'CandidateID' = $_.A
        'FullName' = ($fullName -replace '\s+', ' ').Trim()
        'BallotName' = ($_.'Name on ballot' -replace '\s+', ' ').Trim()
        'ElectoralDistrict' = $_.'Electoral district'
        'Sex' = $_.Sex
        'DataQuality' = $(if ($needsReview) { 'NEEDS_REVIEW' } else { 'OK' })
        'LastUpdated' = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
    }
}

$cleanedData | Export-Csv -Path $cleanedPath -NoTypeInformation -Encoding UTF8
Write-Host "      Saved: CLEANED_CANDIDATES_$timestamp.csv" -ForegroundColor Green

# Summary
Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "RESULTS:" -ForegroundColor Green
Write-Host "  Total Candidates: $total" -ForegroundColor White
Write-Host "  Quality Score: $qualityScore%" -ForegroundColor White
Write-Host "  Need Translation Fix: $issueCount" -ForegroundColor Yellow
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "  1. Fix $issueCount translation errors" -ForegroundColor White
Write-Host "  2. Deploy frontend" -ForegroundColor White
Write-Host "  3. Start social media collection" -ForegroundColor White
Write-Host ""
Write-Host "Cleaned file saved to:" -ForegroundColor Green
Write-Host "  $cleanedPath" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")