@echo off
set KEYSTORE=D:\Games\2DGame\PuzzleGame3\PippoMe\release-keystore.keystore
set PASS=android123
if not exist "%KEYSTORE%" (
    keytool -genkeypair -pippo-me -alias pippo-me -keyalg RSA -keysize 2048 -validity 10000 -keystore "%KEYSTORE%" -storepass "%PASS%" -keypass "%PASS%" -dname "cn=Pippome,o=Unknown" -ext "SAN=dns:pippome.com" 2>&1
) else (
    echo Keystore already exists.
)