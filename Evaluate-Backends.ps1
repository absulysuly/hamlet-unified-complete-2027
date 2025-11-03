# Backend Evaluation Script for E:\HamletUnified
# This script helps you find the BEST backend among all your folders

Write-Host "🔍 Iraqi Election Platform - Backend Evaluator" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

# List of backend locations to check
$backendPaths = @(
    "E:\HamletUnified\backend",
    "E:\HamletUnified\Copy-of-Hamlet-social\backend",
    "E:\HamletUnified\asset-completeredrive\backend",
    "E:\HamletUnified\amlet-live\backend",
    "E:\HamletUnified\iraq-election-platform",
    "E:\HamletUnified\IraqElectinMegaMVP",
    "E:\HamletUnified\hamlet-unified-complete-2027\backend",
    "E:\HamletUnified\HamletUnified_archives\backend",
    "E:\HamletUnified\hamlet-platform-nextjs\backend",
    "E:\HamletUnified\hamlet-complete-mvp\backend",
    "E:\HamletUnified\full_consolidation\backend",
    "E:\HamletUnified\DEADLINESCOIMGELECTIONIRAQ\backend"
)

# Results array
$results = @()

foreach ($path in $backendPaths) {
    Write-Host "`n┌─────────────────────────────────────────────" -ForegroundColor Gray
    Write-Host "│ Checking: $path" -ForegroundColor Yellow
    Write-Host "└─────────────────────────────────────────────`n" -ForegroundColor Gray

    if (-not (Test-Path $path)) {
        Write-Host "  ❌ Path does not exist - SKIP" -ForegroundColor Red
        continue
    }

    $score = 0
    $features = @{
        Path = $path
        HasPackageJson = $false
        HasServerFile = $false
        HasDatabase = $false
        HasRoutes = $false
        HasPrisma = $false
        HasSocialFeatures = $false
        HasElectionFeatures = $false
        HasTests = $false
        HasDocs = $false
        DependencyCount = 0
        RouteCount = 0
        LastModified = $null
        Score = 0
        Recommendation = ""
    }

    # Check package.json
    $packagePath = Join-Path $path "package.json"
    if (Test-Path $packagePath) {
        Write-Host "  ✅ package.json found" -ForegroundColor Green
        $features.HasPackageJson = $true
        $score += 1

        try {
            $pkg = Get-Content $packagePath -Raw | ConvertFrom-Json
            Write-Host "     Name: $($pkg.name)" -ForegroundColor Gray

            if ($pkg.dependencies) {
                $depCount = ($pkg.dependencies.PSObject.Properties | Measure-Object).Count
                $features.DependencyCount = $depCount
                Write-Host "     Dependencies: $depCount" -ForegroundColor Gray

                # Check for key dependencies
                if ($pkg.dependencies.express) {
                    Write-Host "     ✅ Express.js found" -ForegroundColor Green
                    $score += 1
                }
                if ($pkg.dependencies.prisma -or $pkg.dependencies.'@prisma/client') {
                    Write-Host "     ✅ Prisma ORM found" -ForegroundColor Green
                    $features.HasPrisma = $true
                    $features.HasDatabase = $true
                    $score += 2
                }
                if ($pkg.dependencies.pg -or $pkg.dependencies.postgresql) {
                    Write-Host "     ✅ PostgreSQL driver found" -ForegroundColor Green
                    $features.HasDatabase = $true
                    $score += 1
                }
                if ($pkg.dependencies.mongodb -or $pkg.dependencies.mongoose) {
                    Write-Host "     ✅ MongoDB found" -ForegroundColor Green
                    $features.HasDatabase = $true
                    $score += 1
                }
            }
        } catch {
            Write-Host "     ⚠️  Could not parse package.json" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ❌ No package.json found" -ForegroundColor Red
    }

    # Check for server files
    $serverFiles = @("server.js", "index.js", "app.js", "main.js", "src/index.ts", "src/server.ts", "src/main.ts")
    foreach ($file in $serverFiles) {
        $serverPath = Join-Path $path $file
        if (Test-Path $serverPath) {
            Write-Host "  ✅ Server file found: $file" -ForegroundColor Green
            $features.HasServerFile = $true
            $score += 1
            break
        }
    }

    # Check for Prisma schema
    $prismaPath = Join-Path $path "prisma\schema.prisma"
    if (Test-Path $prismaPath) {
        Write-Host "  ✅ Prisma schema found" -ForegroundColor Green
        $features.HasPrisma = $true
        $score += 1

        # Count models in Prisma schema
        try {
            $schemaContent = Get-Content $prismaPath -Raw
            $modelCount = ([regex]::Matches($schemaContent, "model\s+\w+")).Count
            Write-Host "     Models: $modelCount" -ForegroundColor Gray
            $score += [Math]::Min($modelCount / 5, 2)  # Up to 2 points for many models
        } catch {}
    }

    # Check for routes folder
    $routesPaths = @("src\routes", "routes", "api\routes", "src\api")
    foreach ($routePath in $routesPaths) {
        $fullRoutePath = Join-Path $path $routePath
        if (Test-Path $fullRoutePath) {
            Write-Host "  ✅ Routes folder found: $routePath" -ForegroundColor Green
            $features.HasRoutes = $true
            $score += 1

            # Count route files
            $routeFiles = Get-ChildItem -Path $fullRoutePath -Filter "*.js" -File -ErrorAction SilentlyContinue
            $routeFileCount = ($routeFiles | Measure-Object).Count
            $features.RouteCount = $routeFileCount
            Write-Host "     Route files: $routeFileCount" -ForegroundColor Gray
            $score += [Math]::Min($routeFileCount / 3, 2)  # Up to 2 points for many routes

            # Check for specific feature routes
            $routeNames = $routeFiles | ForEach-Object { $_.Name.ToLower() }
            if ($routeNames -match "social|post|user|event") {
                Write-Host "     ✅ Social features detected" -ForegroundColor Green
                $features.HasSocialFeatures = $true
                $score += 2
            }
            if ($routeNames -match "candidate|election|vote|party") {
                Write-Host "     ✅ Election features detected" -ForegroundColor Green
                $features.HasElectionFeatures = $true
                $score += 2
            }

            break
        }
    }

    # Check for tests
    $testPaths = @("test", "tests", "__tests__", "src\__tests__")
    foreach ($testPath in $testPaths) {
        $fullTestPath = Join-Path $path $testPath
        if (Test-Path $fullTestPath) {
            Write-Host "  ✅ Tests folder found" -ForegroundColor Green
            $features.HasTests = $true
            $score += 1
            break
        }
    }

    # Check for documentation
    $docFiles = @("README.md", "API.md", "API_CONTRACT.md", "DEPLOYMENT.md")
    $docCount = 0
    foreach ($doc in $docFiles) {
        $docPath = Join-Path $path $doc
        if (Test-Path $docPath) {
            $docCount++
        }
    }
    if ($docCount -gt 0) {
        Write-Host "  ✅ Documentation found ($docCount files)" -ForegroundColor Green
        $features.HasDocs = $true
        $score += 1
    }

    # Check last modified date
    try {
        $lastMod = (Get-ChildItem -Path $path -Recurse -File | Sort-Object LastWriteTime -Descending | Select-Object -First 1).LastWriteTime
        $features.LastModified = $lastMod
        $daysSince = (Get-Date) - $lastMod
        Write-Host "  📅 Last modified: $($lastMod.ToString('yyyy-MM-dd')) ($([math]::Round($daysSince.TotalDays)) days ago)" -ForegroundColor Gray

        # Bonus for recent updates
        if ($daysSince.TotalDays -lt 30) {
            $score += 1
        }
    } catch {}

    # Calculate final score
    $features.Score = [math]::Round($score, 1)

    # Recommendation
    if ($score -ge 10) {
        $features.Recommendation = "🏆 EXCELLENT - Deploy immediately"
        Write-Host "`n  🏆 SCORE: $score/15 - EXCELLENT!" -ForegroundColor Green
    } elseif ($score -ge 7) {
        $features.Recommendation = "✅ GOOD - Minor fixes needed"
        Write-Host "`n  ✅ SCORE: $score/15 - GOOD" -ForegroundColor Cyan
    } elseif ($score -ge 4) {
        $features.Recommendation = "⚠️  OKAY - Needs work"
        Write-Host "`n  ⚠️  SCORE: $score/15 - NEEDS WORK" -ForegroundColor Yellow
    } else {
        $features.Recommendation = "❌ POOR - Consider alternatives"
        Write-Host "`n  ❌ SCORE: $score/15 - POOR" -ForegroundColor Red
    }

    $results += New-Object PSObject -Property $features
}

# Summary Report
Write-Host "`n`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              📊 BACKEND EVALUATION SUMMARY                 ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$sortedResults = $results | Sort-Object -Property Score -Descending

$rank = 1
foreach ($result in $sortedResults) {
    $rankEmoji = switch ($rank) {
        1 { "🥇" }
        2 { "🥈" }
        3 { "🥉" }
        default { "  " }
    }

    Write-Host "$rankEmoji #$rank - Score: $($result.Score)/15" -ForegroundColor Cyan
    Write-Host "   Path: $($result.Path)" -ForegroundColor White
    Write-Host "   Status: $($result.Recommendation)" -ForegroundColor Gray
    Write-Host "   Features:" -ForegroundColor Gray
    Write-Host "     • Package.json: $(if ($result.HasPackageJson) {'✅'} else {'❌'})" -ForegroundColor Gray
    Write-Host "     • Server file: $(if ($result.HasServerFile) {'✅'} else {'❌'})" -ForegroundColor Gray
    Write-Host "     • Database: $(if ($result.HasDatabase) {'✅'} else {'❌'})" -ForegroundColor Gray
    Write-Host "     • Prisma ORM: $(if ($result.HasPrisma) {'✅'} else {'❌'})" -ForegroundColor Gray
    Write-Host "     • Routes: $(if ($result.HasRoutes) {"✅ ($($result.RouteCount) files)"} else {'❌'})" -ForegroundColor Gray
    Write-Host "     • Social features: $(if ($result.HasSocialFeatures) {'✅'} else {'❌'})" -ForegroundColor Gray
    Write-Host "     • Election features: $(if ($result.HasElectionFeatures) {'✅'} else {'❌'})" -ForegroundColor Gray
    Write-Host "     • Tests: $(if ($result.HasTests) {'✅'} else {'❌'})" -ForegroundColor Gray
    Write-Host "     • Documentation: $(if ($result.HasDocs) {'✅'} else {'❌'})" -ForegroundColor Gray
    Write-Host ""

    $rank++
}

# Top recommendation
$topBackend = $sortedResults | Select-Object -First 1
Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                  🏆 TOP RECOMMENDATION                     ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

if ($topBackend) {
    Write-Host "Deploy this backend: " -NoNewline -ForegroundColor White
    Write-Host "$($topBackend.Path)" -ForegroundColor Yellow
    Write-Host "`nScore: $($topBackend.Score)/15" -ForegroundColor Cyan
    Write-Host "Status: $($topBackend.Recommendation)" -ForegroundColor Green

    Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Copy this backend to your deployment location" -ForegroundColor White
    Write-Host "2. Run: cd `"$($topBackend.Path)`"" -ForegroundColor White
    Write-Host "3. Run: npm install" -ForegroundColor White
    Write-Host "4. Deploy to Railway following backend/DEPLOYMENT.md" -ForegroundColor White
} else {
    Write-Host "❌ No backends found. Check your paths!" -ForegroundColor Red
}

Write-Host "`n✅ Evaluation complete!" -ForegroundColor Green
Write-Host "💾 Results saved to: backend-evaluation-results.json`n" -ForegroundColor Gray

# Export to JSON for reference
$results | ConvertTo-Json -Depth 3 | Out-File "backend-evaluation-results.json"
