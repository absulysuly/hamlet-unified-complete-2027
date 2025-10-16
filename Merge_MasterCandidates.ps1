# ================================
# Merge_MasterCandidates.ps1
# Hamlet Social Platform - Bilingual Candidate Data Merger
# ================================

# --- Configuration ---
$root = "E:\HamletUnified\full_consolidation"
$outputFile = Join-Path $root "master_candidates.csv"
$reportFile = Join-Path $root "merge_report.csv"

# Load Excel support
if (-not (Get-Module -ListAvailable -Name ImportExcel)) {
    Write-Host "Installing ImportExcel module (first-time setup)..." -ForegroundColor Yellow
    Install-Module ImportExcel -Scope CurrentUser -Force
}
Import-Module ImportExcel

# --- Helper: Load CSV or XLSX uniformly ---
function Load-Table($filePath) {
    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
    if ($ext -eq ".csv") {
        try {
            return Import-Csv -Path $filePath -ErrorAction Stop
        } catch {
            Write-Host ⚠️ Skipped unreadable CSV: $filePath" -ForegroundColor Yellow
            return @()
        }
    } elseif ($ext -eq ".xlsx") {
        try {
            return Import-Excel -Path $filePath -ErrorAction Stop
        } catch {
            Write-Host "⚠️ Skipped unreadable XLSX: $filePath" -ForegroundColor Yellow
            return @()
        }
    } else {
        return @()
    }
}

# --- Step 1: Gather all files ---
$files = Get-ChildItem -Path $root -Recurse -Include *.csv, *.xlsx -ErrorAction SilentlyContinue
if ($files.Count -eq 0) {
    Write-Host "❌ No candidate files found in $root" -ForegroundColor Red
    exit
}

Write-Host "`n📦 Found $($files.Count) data files. Starting merge..." -ForegroundColor Cyan

# --- Step 2: Merge data ---
$allData = @()
foreach ($file in $files) {
    $data = Load-Table $file.FullName
    if ($data.Count -gt 0) {
        Write-Host "✅ Loaded: $($file.Name) ($($data.Count) rows)"
        foreach ($row in $data) {
            $row | Add-Member -NotePropertyName SourceFile -NotePropertyValue $file.FullName -Force
            $allData += $row
        }
    }
}

if ($allData.Count -eq 0) {
    Write-Host "❌ No readable data found." -ForegroundColor Red
    exit
}

# --- Step 3: Normalize columns ---
$merged = @()
$allProps = $allData | ForEach-Object { $_.psobject.Properties.Name } | Sort-Object -Unique

Write-Host "`n🧩 Normalizing $($allProps.Count) columns across all datasets..."

# Create a unified list of columns, keeping key bilingual/SM ones
$importantColumns = @(
    "Name","FullName","الاسم","Name_Arabic","Name_Kurdish",
    "Email","EmailAddress","البريد الالكتروني",
    "Phone","Mobile","رقم الهاتف",
    "LinkedIn","Facebook","Twitter","Instagram","TikTok","SocialMedia","SocialMediaLink"
)
$finalColumns = ($importantColumns + $allProps) | Sort-Object -Unique

# --- Step 4: Clean duplicates ---
$seen = @{}
foreach ($row in $allData) {
    # Key by email or name
    $key = ($row.Email, $row.FullName, $row.Name, $row.'الاسم' -join "|").Trim()
    if (-not $seen.ContainsKey($key)) {
        $seen[$key] = $true
        $merged += $row
    }
}

Write-Host "`n✨ Unique entries: $($merged.Count)"

# --- Step 5: Create bilingual structure ---
$finalData = $merged | ForEach-Object {
    [PSCustomObject]@{
        Candidate_ID = [guid]::NewGuid().ToString()
        Name_EN = $_.Name ?? $_.FullName
        Name_AR_KU = $_.'الاسم' ?? $_.Name_Arabic ?? $_.Name_Kurdish
        Email = $_.Email ?? $_.EmailAddress
        Phone = $_.Phone ?? $_.Mobile
        LinkedIn = $_.LinkedIn
        Facebook = $_.Facebook
        Twitter = $_.Twitter
        Instagram = $_.Instagram
        TikTok = $_.TikTok
        Other_Social = $_.SocialMedia ?? $_.SocialMediaLink
        SourceFile = $_.SourceFile
    }
}

# --- Step 6: Export results ---
$finalData | Export-Csv -Path $outputFile -NoTypeInformation -Encoding UTF8
$files | Select-Object FullName, Length, LastWriteTime | Export-Csv -Path $reportFile -NoTypeInformation -Encoding UTF8

Write-Host "`n✅ Merge complete!"
Write-Host "Output file: $outputFile"
Write-Host "Report file: $reportFile"
Write-Host "`nNext: Open master_candidates.csv in Excel to verify bilingual columns."
