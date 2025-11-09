Param(
    [int]$Workers = 4,
    [switch]$InstallWebDriver
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path ".venv")) {
    Write-Host "Creating virtual environment..."
    python -m venv .venv
}

Write-Host "Activating virtual environment"
. .\.venv\Scripts\Activate.ps1

Write-Host "Installing requirements"
pip install --upgrade pip
pip install -r requirements.txt

if ($InstallWebDriver) {
    Write-Host "Ensuring ChromeDriver is available via webdriver-manager"
    python - <<'PYCODE'
from webdriver_manager.chrome import ChromeDriverManager
ChromeDriverManager().install()
PYCODE
}

Write-Host "Running IHEC Mega Scrubber"
python run_scrubber.py run --workers $Workers

$destinationRoot = "E:\HamletUnified\IHEC_Extractor"
$outputDest = Join-Path $destinationRoot "output"
$rawDest = Join-Path $destinationRoot "raw_pages"
New-Item -ItemType Directory -Force -Path $outputDest | Out-Null
New-Item -ItemType Directory -Force -Path $rawDest | Out-Null

Copy-Item -Path .\output\* -Destination $outputDest -Force
Copy-Item -Path .\raw_pages\* -Destination $rawDest -Force
Copy-Item -Path .\extraction_log.jsonl -Destination $destinationRoot -Force -ErrorAction SilentlyContinue
Copy-Item -Path .\mega_executor.log -Destination $destinationRoot -Force -ErrorAction SilentlyContinue

$timestamp = Get-Date -Format "yyyyMMdd_HHmm"
$zipPath = Join-Path $destinationRoot ("IHEC_extract_{0}.zip" -f $timestamp)
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
$itemsToZip = @($outputDest, $rawDest)
$logPath = Join-Path $destinationRoot "mega_executor.log"
$extractLogPath = Join-Path $destinationRoot "extraction_log.jsonl"
if (Test-Path $logPath) { $itemsToZip += $logPath }
if (Test-Path $extractLogPath) { $itemsToZip += $extractLogPath }
Compress-Archive -Path $itemsToZip -DestinationPath $zipPath -Force

Write-Host "Artifacts archived to $zipPath"
