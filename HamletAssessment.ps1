# HAMLET PROJECT RESCUE - COMPREHENSIVE ASSESSMENT SCRIPT
# Director: Full Folder Analysis & Salvage Report
# Date: October 14, 2025

$rootPath = "E:\HamletUnified"
$reportPath = "E:\HamletUnified\ASSESSMENT_REPORT_$(Get-Date -Format 'yyyyMMdd_HHmmss').txt"

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "HAMLET PROJECT RESCUE ASSESSMENT" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Initialize report
$report = @"
HAMLET PROJECT COMPREHENSIVE ASSESSMENT
Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Root Path: $rootPath

========================================
EXECUTIVE SUMMARY
========================================

"@

# Function to get folder size
function Get-FolderSize {
    param($path)
    try {
        $size = (Get-ChildItem -Path $path -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        return [math]::Round($size / 1MB, 2)
    } catch {
        return 0
    }
}

# Function to analyze folder contents
function Analyze-Folder {
    param($path, $depth = 0)
    
    $indent = "  " * $depth
    $folderName = Split-Path $path -Leaf
    $size = Get-FolderSize $path
    
    Write-Host "$indent[FOLDER] $folderName (${size}MB)" -ForegroundColor Yellow
    
    $analysis = @{
        Path = $path
        Name = $folderName
        Size = $size
        Files = @{}
        Subfolders = @()
    }
    
    # Count file types
    try {
        $files = Get-ChildItem -Path $path -File -ErrorAction SilentlyContinue
        foreach ($file in $files) {
            $ext = $file.Extension.ToLower()
            if (-not $analysis.Files.ContainsKey($ext)) {
                $analysis.Files[$ext] = 0
            }
            $analysis.Files[$ext]++
        }
        
        # Get subfolders
        $subfolders = Get-ChildItem -Path $path -Directory -ErrorAction SilentlyContinue
        foreach ($subfolder in $subfolders) {
            $analysis.Subfolders += Analyze-Folder $subfolder.FullName ($depth + 1)
        }
    } catch {
        Write-Host "$indent  [WARNING] Access denied or error" -ForegroundColor Red
    }
    
    return $analysis
}

# Start analysis
Write-Host "Scanning folder structure..." -ForegroundColor Green
$fullAnalysis = Analyze-Folder $rootPath

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "SEARCHING FOR CRITICAL FILES" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. CANDIDATE DATA FILES (CSVs)
Write-Host "[SEARCH] Candidate CSV files..." -ForegroundColor Green
$csvFiles = Get-ChildItem -Path $rootPath -Recurse -Filter "*.csv" -File -ErrorAction SilentlyContinue | 
    Select-Object FullName, Name, Length, LastWriteTime | 
    Sort-Object Length -Descending

$report += "`n========================================`n"
$report += "1. CANDIDATE DATA FILES (CSV)`n"
$report += "========================================`n"
$report += "Total CSV files found: $($csvFiles.Count)`n`n"

foreach ($csv in $csvFiles) {
    $sizeMB = [math]::Round($csv.Length / 1MB, 2)
    $relativePath = $csv.FullName.Replace($rootPath, "")
    $report += "[DATA] $($csv.Name)`n"
    $report += "   Path: $relativePath`n"
    $report += "   Size: ${sizeMB}MB`n"
    $report += "   Modified: $($csv.LastWriteTime)`n"
    
    # Try to count rows
    try {
        $rowCount = (Get-Content $csv.FullName | Measure-Object -Line).Lines - 1
        $report += "   Rows: $rowCount candidates`n"
        Write-Host "  [OK] $($csv.Name): $rowCount rows, ${sizeMB}MB" -ForegroundColor White
    } catch {
        $report += "   Rows: Unable to read`n"
        Write-Host "  [WARNING] $($csv.Name): Unable to read" -ForegroundColor Yellow
    }
    $report += "`n"
}

# 2. FRONTEND CODE (HTML, JS, React)
Write-Host "`n[SEARCH] Frontend code..." -ForegroundColor Green
$frontendFiles = @{
    'HTML' = Get-ChildItem -Path $rootPath -Recurse -Filter "*.html" -File -ErrorAction SilentlyContinue
    'JavaScript' = Get-ChildItem -Path $rootPath -Recurse -Filter "*.js" -File -ErrorAction SilentlyContinue
    'React_JSX' = Get-ChildItem -Path $rootPath -Recurse -Filter "*.jsx" -File -ErrorAction SilentlyContinue
    'TypeScript' = Get-ChildItem -Path $rootPath -Recurse -Filter "*.ts" -File -ErrorAction SilentlyContinue
    'CSS' = Get-ChildItem -Path $rootPath -Recurse -Filter "*.css" -File -ErrorAction SilentlyContinue
}

$report += "`n========================================`n"
$report += "2. FRONTEND CODE FILES`n"
$report += "========================================`n"

foreach ($type in $frontendFiles.Keys) {
    $files = $frontendFiles[$type]
    $report += "`n$type Files: $($files.Count)`n"
    Write-Host "  $type - $($files.Count) files" -ForegroundColor White
    
    if ($files.Count -gt 0 -and $files.Count -le 20) {
        foreach ($file in $files) {
            $relativePath = $file.FullName.Replace($rootPath, "")
            $report += "  - $relativePath`n"
        }
    }
}

# 3. PACKAGE.JSON & DEPENDENCIES
Write-Host "`n[SEARCH] package.json files..." -ForegroundColor Green
$packageFiles = Get-ChildItem -Path $rootPath -Recurse -Filter "package.json" -File -ErrorAction SilentlyContinue

$report += "`n========================================`n"
$report += "3. PROJECT CONFIGURATIONS`n"
$report += "========================================`n"
$report += "package.json files found: $($packageFiles.Count)`n`n"

foreach ($pkg in $packageFiles) {
    $relativePath = $pkg.FullName.Replace($rootPath, "")
    $report += "[CONFIG] $relativePath`n"
    Write-Host "  [OK] Found: $relativePath" -ForegroundColor White
    
    try {
        $pkgContent = Get-Content $pkg.FullName -Raw | ConvertFrom-Json
        $report += "   Name: $($pkgContent.name)`n"
        $report += "   Version: $($pkgContent.version)`n"
        if ($pkgContent.dependencies) {
            $report += "   Dependencies: $($pkgContent.dependencies.PSObject.Properties.Count)`n"
        }
    } catch {
        $report += "   Unable to parse`n"
    }
    $report += "`n"
}

# 4. PYTHON SCRIPTS (for agents/automation)
Write-Host "`n[SEARCH] Python scripts..." -ForegroundColor Green
$pythonFiles = Get-ChildItem -Path $rootPath -Recurse -Filter "*.py" -File -ErrorAction SilentlyContinue

$report += "`n========================================`n"
$report += "4. PYTHON AUTOMATION SCRIPTS`n"
$report += "========================================`n"
$report += "Python files found: $($pythonFiles.Count)`n`n"

foreach ($py in $pythonFiles) {
    $relativePath = $py.FullName.Replace($rootPath, "")
    $report += "[PYTHON] $relativePath`n"
    Write-Host "  [OK] $($py.Name)" -ForegroundColor White
}

# 5. DOCUMENTATION
Write-Host "`n[SEARCH] Documentation..." -ForegroundColor Green
$docFiles = Get-ChildItem -Path $rootPath -Recurse -Include "*.md","*.txt","README*" -File -ErrorAction SilentlyContinue

$report += "`n========================================`n"
$report += "5. DOCUMENTATION & NOTES`n"
$report += "========================================`n"
$report += "Documentation files found: $($docFiles.Count)`n`n"

foreach ($doc in $docFiles) {
    $relativePath = $doc.FullName.Replace($rootPath, "")
    $report += "[DOC] $relativePath`n"
    Write-Host "  [OK] $($doc.Name)" -ForegroundColor White
}

# 6. FOLDER STRUCTURE SUMMARY
$report += "`n========================================`n"
$report += "6. FOLDER STRUCTURE & SIZES`n"
$report += "========================================`n"

function Format-FolderTree {
    param($analysis, $depth = 0)
    $indent = "  " * $depth
    $output = "$indent[FOLDER] $($analysis.Name) ($($analysis.Size)MB)`n"
    
    if ($analysis.Files.Count -gt 0) {
        foreach ($ext in $analysis.Files.Keys) {
            $output += "$indent  |-- $ext files: $($analysis.Files[$ext])`n"
        }
    }
    
    foreach ($subfolder in $analysis.Subfolders) {
        $output += Format-FolderTree $subfolder ($depth + 1)
    }
    
    return $output
}

$report += Format-FolderTree $fullAnalysis

# 7. RECOMMENDATIONS
$report += "`n========================================`n"
$report += "7. DIRECTOR RECOMMENDATIONS`n"
$report += "========================================`n"

# Analyze candidate data
$largestCSV = $csvFiles | Sort-Object Length -Descending | Select-Object -First 1
if ($largestCSV) {
    $report += "`n[RECOMMENDATION] PRIMARY CANDIDATE DATA:`n"
    $report += "   File: $($largestCSV.Name)`n"
    $report += "   This appears to be your master candidate list.`n"
    $report += "   ACTION: Use this as primary data source.`n"
}

# Check for MVP
$mvpFolder = Get-ChildItem -Path $rootPath -Directory -Filter "*social*" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($mvpFolder) {
    $report += "`n[RECOMMENDATION] MVP FRONTEND DETECTED:`n"
    $report += "   Folder: $($mvpFolder.Name)`n"
    $report += "   ACTION: Assess functionality and complete.`n"
}

# Check for backups
$backupFolders = Get-ChildItem -Path $rootPath -Directory -Filter "*backup*" -ErrorAction SilentlyContinue
if ($backupFolders) {
    $report += "`n[WARNING] BACKUP FOLDERS FOUND: $($backupFolders.Count)`n"
    $report += "   ACTION: Extract any unique work, then archive.`n"
}

$report += "`n========================================`n"
$report += "NEXT STEPS`n"
$report += "========================================`n"
$report += "1. Review this report carefully`n"
$report += "2. Identify the BEST candidate CSV file`n"
$report += "3. Assess MVP folder functionality`n"
$report += "4. Extract valuable features from old versions`n"
$report += "5. Create consolidated workspace structure`n"
$report += "6. Begin parallel work: MVP + Social Media Collection`n"

# Save report
$report | Out-File -FilePath $reportPath -Encoding UTF8

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "ASSESSMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Report saved to: $reportPath" -ForegroundColor Yellow
Write-Host ""
Write-Host "[REPORT] Review the report and share key findings for next steps." -ForegroundColor White
Write-Host ""

# Open report automatically
Start-Process notepad.exe $reportPath