Param(
    [int]$Workers = 4
)

$ErrorActionPreference = "Stop"

$global:LauncherMetrics = @()

function Add-Metric {
    param(
        [string]$Name,
        [TimeSpan]$Duration,
        [string]$Status
    )

    $global:LauncherMetrics += [PSCustomObject]@{
        stage     = $Name
        duration  = [math]::Round($Duration.TotalSeconds, 3)
        status    = $Status
        timestamp = (Get-Date).ToString("o")
    }
}

function Invoke-Step {
    param(
        [string]$Name,
        [scriptblock]$Action
    )

    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    $status = "success"
    try {
        & $Action.Invoke()
        if ($LASTEXITCODE -ne 0) {
            throw "Step '$Name' exited with code $LASTEXITCODE"
        }
    }
    catch {
        $status = "failure"
        Write-Error $_
        throw
    }
    finally {
        $stopwatch.Stop()
        Add-Metric -Name $Name -Duration $stopwatch.Elapsed -Status $status
    }
}

try {
    if (-not (Test-Path ".venv")) {
        Write-Host "Creating virtual environment..."
        python -m venv .venv
    }

    Write-Host "Activating virtual environment"
    . .\.venv\Scripts\Activate.ps1

    Invoke-Step -Name "install_requirements" -Action {
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    }

    Invoke-Step -Name "dry_run" -Action {
        python run_scrubber.py dry-run
    }

    Invoke-Step -Name "full_run" -Action {
        python run_scrubber.py run --workers $Workers
    }

    if (-not (Test-Path "output")) {
        New-Item -ItemType Directory -Path "output" | Out-Null
    }

    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $zipPath = Join-Path (Get-Location) ("IHEC_extract_{0}.zip" -f $timestamp)
    if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

    Invoke-Step -Name "archive_outputs" -Action {
        Compress-Archive -Path (Join-Path (Get-Location) "output\*") -DestinationPath $zipPath -Force
    }

    Write-Host "Artifacts archived to $zipPath"
}
finally {
    if (-not (Test-Path "output")) {
        New-Item -ItemType Directory -Path "output" | Out-Null
    }
    $metricsPath = Join-Path (Get-Location) "output\launcher_metrics.jsonl"
    if (Test-Path $metricsPath) { Remove-Item $metricsPath -Force }
    $LauncherMetrics | ForEach-Object {
        $_ | ConvertTo-Json -Compress | Out-File -FilePath $metricsPath -Encoding utf8 -Append
    }
    Write-Host "Metrics written to $metricsPath"
}
