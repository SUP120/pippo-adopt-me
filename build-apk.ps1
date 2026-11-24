# Builds the Pippo & Me debug APK.
# Stages the game web files into app/src/main/assets/www, runs gradle, copies the APK to the repo root.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path   # ...\PuzzleGame3\PippoMe
$game = Split-Path -Parent $root                          # ...\PuzzleGame3
$www  = Join-Path $root 'app\src\main\assets\www'

# --- stage web assets (fully offline: html + css + js + fonts) ---
Remove-Item -Recurse -Force $www -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $www | Out-Null
foreach ($item in 'index.html', 'manifest.webmanifest', 'css', 'js', 'fonts') {
    Copy-Item -Recurse -Force -Path (Join-Path $game $item) -Destination (Join-Path $www $item)
}
Write-Host ("Staged www: " + ((Get-ChildItem -Recurse $www -File | Measure-Object Length -Sum).Sum / 1MB).ToString('0.0') + " MB")

# --- build ---
$env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jbr'
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
Push-Location $root
try {
    & .\gradlew.bat assembleDebug --console=plain
    if ($LASTEXITCODE -ne 0) { throw "gradlew failed with exit code $LASTEXITCODE" }
} finally {
    Pop-Location
}

$apk = Join-Path $root 'app\build\outputs\apk\debug\app-debug.apk'
if (-not (Test-Path $apk)) { throw 'APK not produced' }
$out = Join-Path $game 'PippoMe-debug.apk'
Copy-Item $apk $out -Force
Write-Host "APK ready: $out"
