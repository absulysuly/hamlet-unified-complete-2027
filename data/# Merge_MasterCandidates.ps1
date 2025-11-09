# ================================
# Hamlet Social Platform - Auto Merge Candidate Data
# ================================

# --- Configuration ---
$root = "E:\HamletUnified\full_consolidation"
$outputFile = Join-Path $root "master_candidates.csv"
$reportFile = Join-Path $root "merge_report.csv"

# Install ImportExcel if missing
if (-not (Get-Module -ListAvailable -Name ImportExcel)) {
    Install-Module ImportExcel -Scope CurrentUser -Force
}
Import-Module ImportExcel

# --- Helper function to load CSV/XLSX files ---
function Load-Table($filePath) {
    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
    if ($ext -eq ".csv") {
        try { return Import-Csv -Path $filePath -ErrorAction Stop } catch { return @() }
    } elseif ($ext -eq ".xlsx") {
        try { return Import-Excel -Path $filePath -ErrorAction Stop } catch { return @() }
    } else { return @() }
}

# --- Gather all CSV/XLSX files in full_consolidation ---
$files = Get-ChildItem -Path $root -Recurse -Include *.csv, *.xlsx | Where-Object { $_.Name -notlike "*master_candidates*" }

if ($files.Count -eq 0) {
    Write-Host "❌ No candidate files found in $root" -ForegroundColor Red
    exit
}

# --- Merge data ---
$allData = @()
foreach ($file in $files) {
    $data = Load-Table $file.FullName
    if ($data.Count -gt 0) {
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

# --- Remove duplicates (key by email or name) ---
$merged = @()
$seen = @{}
foreach ($row in $allData) {
    $key = ($row.Email, $row.FullName, $row.Name, $row.'الاسم' -join "|").Trim()
    if (-not $seen.ContainsKey($key)) {
        $seen[$key] = $true
        $merged += $row
    }
}

# --- Create bilingual structure ---
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

# --- Export results ---
$finalData | Export-Csv -Path $outputFile -NoTypeInformation -Encoding UTF8
$files | Select-Object FullName, Length, LastWriteTime | Export-Csv -Path $reportFile -NoTypeInformation -Encoding UTF8

Write-Host "✅ Merge complete!"
Write-Host "Output file: $outputFile"
Write-Host "Report file: $reportFile"
