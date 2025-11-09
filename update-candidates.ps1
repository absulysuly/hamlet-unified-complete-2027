# Define paths
$BackendPath = "E:\HamletUnified\hamlet-complete-mvp\backend"
$CsvSourcePath = "E:\HamletUnified\hamlet-unified-complete-2027\data\MASTER_CANDIDATES_7769.csv"
$CsvTargetPath = "$BackendPath\data\MASTER_CANDIDATES.csv"

# Step 1: Copy the CSV file to the backend
Write-Host "📦 Updating candidate data in backend..."
Copy-Item -Path $CsvSourcePath -Destination $CsvTargetPath -Force

# Step 2: Navigate to backend and run import script
Set-Location $BackendPath
Write-Host "🔄 Running backend import script..."
npm install
node importCandidates.mjs

# Step 3: Commit and push backend changes
Write-Host "🔄 Committing backend updates..."
git add .
git commit -m "🔥 Updated candidate data"
git push

# Step 4: Trigger frontend redeploy if needed
$FrontendPath = "E:\HamletUnified\DigitalDemocracy-Iraq"
if (Test-Path $FrontendPath) {
    Write-Host "🔁 Rebuilding and redeploying frontend..."
    Set-Location $FrontendPath
    git add .
    git commit -m "⚡ Sync frontend with updated backend data"
    git push
}

Write-Host "✅ All steps completed. Your platform should now be updated and live."

# Optionally, add some logging or error handling as needed
