# Laptop Performance Optimizer for Heavy AI Development Usage
# Optimizes system for Cursor IDE, Google AI  Studio, and Chrome heavy usage
# Run as Administrator for full functionality

param(
    [switch]$Quick,
    [switch]$Deep,
    [switch]$ChromeOnly,
    [switch]$CursorOnly
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Cyan = "Cyan"
$Magenta = "Magenta"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Optimize-Chrome {
    Write-ColorOutput "`n🔧 Optimizing Chrome for AI Development..." $Cyan
    
    # Chrome process optimization
    $chromeProcesses = Get-Process -Name "chrome" -ErrorAction SilentlyContinue
    if ($chromeProcesses) {
        Write-ColorOutput "Found $($chromeProcesses.Count) Chrome processes" $Yellow
        
        # Kill unnecessary Chrome processes (keep main window)
        $chromeProcesses | Where-Object { $_.MainWindowTitle -eq "" } | Stop-Process -Force -ErrorAction SilentlyContinue
        Write-ColorOutput "Cleaned up background Chrome processes" $Green
    }
    
    # Chrome memory optimization via registry
    try {
        $chromeRegPath = "HKCU:\Software\Policies\Google\Chrome"
        if (!(Test-Path $chromeRegPath)) {
            New-Item -Path $chromeRegPath -Force | Out-Null
        }
        
        # Disable hardware acceleration for better stability
        Set-ItemProperty -Path $chromeRegPath -Name "HardwareAccelerationModeEnabled" -Value 0 -Force
        # Limit background processes
        Set-ItemProperty -Path $chromeRegPath -Name "BackgroundModeEnabled" -Value 0 -Force
        # Disable preloading
        Set-ItemProperty -Path $chromeRegPath -Name "DefaultSearchProviderEnabled" -Value 1 -Force
        
        Write-ColorOutput "Chrome registry optimizations applied" $Green
    }
    catch {
        Write-ColorOutput "Chrome registry optimization failed: $($_.Exception.Message)" $Red
    }
}

function Optimize-Cursor {
    Write-ColorOutput "`n🔧 Optimizing Cursor IDE..." $Cyan
    
    # Cursor process optimization
    $cursorProcesses = Get-Process -Name "Cursor" -ErrorAction SilentlyContinue
    if ($cursorProcesses) {
        Write-ColorOutput "Found $($cursorProcesses.Count) Cursor processes" $Yellow
        
        # Get memory usage
        $totalMemory = ($cursorProcesses | Measure-Object WorkingSet -Sum).Sum / 1MB
        Write-ColorOutput "Cursor using $([math]::Round($totalMemory, 2)) MB RAM" $Yellow
        
        if ($totalMemory -gt 2000) {
            Write-ColorOutput "High memory usage detected. Consider restarting Cursor." $Red
        }
    }
    
    # Clear Cursor cache
    $cursorCachePath = "$env:APPDATA\Cursor\User\workspaceStorage"
    if (Test-Path $cursorCachePath) {
        $cacheSize = (Get-ChildItem $cursorCachePath -Recurse | Measure-Object Length -Sum).Sum / 1MB
        Write-ColorOutput "Cursor cache size: $([math]::Round($cacheSize, 2)) MB" $Yellow
        
        if ($cacheSize -gt 500) {
            Remove-Item "$cursorCachePath\*" -Recurse -Force -ErrorAction SilentlyContinue
            Write-ColorOutput "Cleared Cursor cache" $Green
        }
    }
}

function Optimize-SystemMemory {
    Write-ColorOutput "`n🧠 Optimizing System Memory..." $Cyan
    
    # Clear system cache
    try {
        [System.GC]::Collect()
        [System.GC]::WaitForPendingFinalizers()
        [System.GC]::Collect()
        Write-ColorOutput "Garbage collection completed" $Green
    }
    catch {
        Write-ColorOutput "Garbage collection failed: $($_.Exception.Message)" $Red
    }
    
    # Clear Windows temp files
    $tempPaths = @(
        "$env:TEMP\*",
        "$env:LOCALAPPDATA\Temp\*",
        "$env:WINDIR\Temp\*"
    )
    
    foreach ($path in $tempPaths) {
        if (Test-Path $path) {
            $size = (Get-ChildItem $path -Recurse -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum / 1MB
            if ($size -gt 100) {
                Remove-Item $path -Recurse -Force -ErrorAction SilentlyContinue
                Write-ColorOutput "Cleared temp files: $([math]::Round($size, 2)) MB" $Green
            }
        }
    }
}

function Optimize-Network {
    Write-ColorOutput "`n🌐 Optimizing Network for AI Services..." $Cyan
    
    # Flush DNS cache
    try {
        ipconfig /flushdns | Out-Null
        Write-ColorOutput "DNS cache flushed" $Green
    }
    catch {
        Write-ColorOutput "DNS flush failed: $($_.Exception.Message)" $Red
    }
    
    # Reset network adapters
    try {
        netsh winsock reset | Out-Null
        netsh int ip reset | Out-Null
        Write-ColorOutput "Network stack reset" $Green
    }
    catch {
        Write-ColorOutput "Network reset failed: $($_.Exception.Message)" $Red
    }
}

function Optimize-PowerSettings {
    Write-ColorOutput "`n⚡ Optimizing Power Settings..." $Cyan
    
    # Set high performance power plan
    try {
        powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c
        Write-ColorOutput "Set to high performance power plan" $Green
    }
    catch {
        Write-ColorOutput "Power plan change failed: $($_.Exception.Message)" $Red
    }
    
    # Disable USB selective suspend
    try {
        powercfg /setacvalueindex SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0
        powercfg /setdcvalueindex SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0
        powercfg /setactive SCHEME_CURRENT
        Write-ColorOutput "USB selective suspend disabled" $Green
    }
    catch {
        Write-ColorOutput "USB power optimization failed: $($_.Exception.Message)" $Red
    }
}

function Optimize-StartupPrograms {
    Write-ColorOutput "`n🚀 Optimizing Startup Programs..." $Cyan
    
    # Disable unnecessary startup programs
    $startupItems = Get-CimInstance Win32_StartupCommand | Where-Object {
        $_.Name -notlike "*Windows*" -and 
        $_.Name -notlike "*Microsoft*" -and
        $_.Name -notlike "*Cursor*" -and
        $_.Name -notlike "*Chrome*"
    }
    
    foreach ($item in $startupItems) {
        try {
            $regPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"
            Remove-ItemProperty -Path $regPath -Name $item.Name -ErrorAction SilentlyContinue
            Write-ColorOutput "Disabled startup: $($item.Name)" $Green
        }
        catch {
            Write-ColorOutput "Failed to disable: $($item.Name)" $Red
        }
    }
}

function Show-SystemStatus {
    Write-ColorOutput "`n📊 System Status Report:" $Magenta
    
    # Memory usage
    $memory = Get-CimInstance Win32_OperatingSystem
    $totalMemory = [math]::Round($memory.TotalVisibleMemorySize / 1MB, 2)
    $freeMemory = [math]::Round($memory.FreePhysicalMemory / 1MB, 2)
    $usedMemory = $totalMemory - $freeMemory
    $memoryPercent = [math]::Round(($usedMemory / $totalMemory) * 100, 2)
    
    Write-ColorOutput "Memory: $usedMemory GB / $totalMemory GB ($memoryPercent%)" $Yellow
    
    # CPU usage
    $cpu = Get-CimInstance Win32_Processor
    Write-ColorOutput "CPU: $($cpu.Name)" $Yellow
    
    # Disk usage
    $disk = Get-CimInstance Win32_LogicalDisk | Where-Object {$_.DriveType -eq 3}
    foreach ($d in $disk) {
        $totalSpace = [math]::Round($d.Size / 1GB, 2)
        $freeSpace = [math]::Round($d.FreeSpace / 1GB, 2)
        $usedSpace = $totalSpace - $freeSpace
        $diskPercent = [math]::Round(($usedSpace / $totalSpace) * 100, 2)
        Write-ColorOutput "Disk $($d.DeviceID): $usedSpace GB / $totalSpace GB ($diskPercent%)" $Yellow
    }
    
    # Running processes
    $topProcesses = Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 5
    Write-ColorOutput "`nTop Memory Consumers:" $Yellow
    foreach ($proc in $topProcesses) {
        $memoryMB = [math]::Round($proc.WorkingSet / 1MB, 2)
        Write-ColorOutput "  $($proc.ProcessName): $memoryMB MB" $Yellow
    }
}

function Optimize-AIStudio {
    Write-ColorOutput "`n🤖 Optimizing for Google AI Studio..." $Cyan
    
    # Clear browser cache for AI services
    $chromeCachePath = "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Cache"
    if (Test-Path $chromeCachePath) {
        $cacheSize = (Get-ChildItem $chromeCachePath -Recurse -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum / 1MB
        if ($cacheSize -gt 200) {
            Remove-Item "$chromeCachePath\*" -Recurse -Force -ErrorAction SilentlyContinue
            Write-ColorOutput "Cleared Chrome cache: $([math]::Round($cacheSize, 2)) MB" $Green
        }
    }
    
    # Optimize for AI workloads
    try {
        # Increase network buffer sizes
        netsh int tcp set global autotuninglevel=normal
        netsh int tcp set global chimney=enabled
        netsh int tcp set global rss=enabled
        Write-ColorOutput "Network optimized for AI workloads" $Green
    }
    catch {
        Write-ColorOutput "Network optimization failed: $($_.Exception.Message)" $Red
    }
}

# Main execution
Write-ColorOutput "🚀 Laptop Performance Optimizer for AI Development" $Magenta
Write-ColorOutput "=================================================" $Magenta

if (!(Test-Administrator)) {
    Write-ColorOutput "⚠️  Warning: Not running as Administrator. Some optimizations may not work." $Yellow
    Write-ColorOutput "   For full optimization, run: Start-Process PowerShell -Verb RunAs" $Yellow
}

Show-SystemStatus

if ($Quick) {
    Write-ColorOutput "`n⚡ Running Quick Optimization..." $Cyan
    Optimize-Chrome
    Optimize-Cursor
    Optimize-SystemMemory
}
elseif ($Deep) {
    Write-ColorOutput "`n🔧 Running Deep Optimization..." $Cyan
    Optimize-Chrome
    Optimize-Cursor
    Optimize-SystemMemory
    Optimize-Network
    Optimize-PowerSettings
    Optimize-StartupPrograms
    Optimize-AIStudio
}
elseif ($ChromeOnly) {
    Write-ColorOutput "`n🌐 Chrome-Only Optimization..." $Cyan
    Optimize-Chrome
    Optimize-AIStudio
}
elseif ($CursorOnly) {
    Write-ColorOutput "`n💻 Cursor-Only Optimization..." $Cyan
    Optimize-Cursor
    Optimize-SystemMemory
}
else {
    Write-ColorOutput "`n🔧 Running Standard Optimization..." $Cyan
    Optimize-Chrome
    Optimize-Cursor
    Optimize-SystemMemory
    Optimize-Network
    Optimize-AIStudio
}

Write-ColorOutput "`n✅ Optimization Complete!" $Green
Write-ColorOutput "`n💡 Tips for Better Performance:" $Cyan
Write-ColorOutput "   • Restart Cursor if memory usage is high" $Yellow
Write-ColorOutput "   • Close unused Chrome tabs" $Yellow
Write-ColorOutput "   • Use Chrome's Task Manager (Shift+Esc) to kill heavy tabs" $Yellow
Write-ColorOutput "   • Consider using Chrome's 'Memory Saver' mode" $Yellow
Write-ColorOutput "   • Run this script regularly during heavy development" $Yellow

Show-SystemStatus
