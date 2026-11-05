#!/usr/bin/env bash
set -euo pipefail
# Requires ANDROID_JAR, ANDROID_BUILD_TOOLS, JAVA_HOME, SIGNING_KEYSTORE,
# SIGNING_KEY_ALIAS, SIGNING_STORE_PASSWORD and SIGNING_KEY_PASSWORD.
: "${ANDROID_JAR:?set ANDROID_JAR to an Android platform android.jar}"
: "${ANDROID_BUILD_TOOLS:?set ANDROID_BUILD_TOOLS to an Android SDK build-tools directory}"
: "${JAVA_HOME:?set JAVA_HOME to a JDK}"
: "${SIGNING_KEYSTORE:?set SIGNING_KEYSTORE to your private keystore}"
: "${SIGNING_KEY_ALIAS:?set SIGNING_KEY_ALIAS}"
: "${SIGNING_STORE_PASSWORD:?set SIGNING_STORE_PASSWORD}"
: "${SIGNING_KEY_PASSWORD:?set SIGNING_KEY_PASSWORD}"
export JAVA_HOME SIGNING_STORE_PASSWORD SIGNING_KEY_PASSWORD
export PATH="$JAVA_HOME/bin:$PATH"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/android/build"
TOOLS="$ANDROID_BUILD_TOOLS"
rm -rf "$OUT"
mkdir -p "$OUT/assets/www/src" "$OUT/classes" "$OUT/dex"
cp "$ROOT/index.html" "$OUT/assets/www/index.html"
cp -R "$ROOT/src/." "$OUT/assets/www/src/"
"$TOOLS/aapt" package -f -M "$ROOT/android/app/src/main/AndroidManifest.xml" -S "$ROOT/android/app/src/main/res" -A "$OUT/assets" -I "$ANDROID_JAR" -F "$OUT/unsigned.apk"
"$JAVA_HOME/bin/javac" --release 8 -classpath "$ANDROID_JAR" -d "$OUT/classes" "$ROOT/android/app/src/main/java/com/vajehrah/app/MainActivity.java"
"$TOOLS/d8" --min-api 23 --lib "$ANDROID_JAR" --output "$OUT/dex" $(find "$OUT/classes" -name '*.class' -print)
(cd "$OUT/dex" && "$JAVA_HOME/bin/jar" uf "$OUT/unsigned.apk" classes.dex)
"$TOOLS/zipalign" -f -p 4 "$OUT/unsigned.apk" "$OUT/aligned.apk"
"$TOOLS/apksigner" sign --ks "$SIGNING_KEYSTORE" --ks-key-alias "$SIGNING_KEY_ALIAS" --ks-pass env:SIGNING_STORE_PASSWORD --key-pass env:SIGNING_KEY_PASSWORD --out "$OUT/vajehrah-0.1.0.apk" "$OUT/aligned.apk"
"$TOOLS/apksigner" verify --verbose "$OUT/vajehrah-0.1.0.apk"
echo "APK: $OUT/vajehrah-0.1.0.apk"
