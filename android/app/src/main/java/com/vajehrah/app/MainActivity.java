package com.vajehrah.app;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

/** Offline WebView shell. Only bundled assets can load in this WebView. */
public final class MainActivity extends Activity {
    private static final String HOST = "appassets.vajehrah.local";
    private WebView webView;
    private TextToSpeech speech;
    private boolean speechReady;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(Color.rgb(255, 255, 255));
        getWindow().getDecorView().setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        speech = new TextToSpeech(this, status -> {
            if (status == TextToSpeech.SUCCESS && speech != null) {
                int result = speech.setLanguage(Locale.US);
                speechReady = result != TextToSpeech.LANG_MISSING_DATA && result != TextToSpeech.LANG_NOT_SUPPORTED;
                speech.setSpeechRate(0.85f);
            }
        });
        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        webView.addJavascriptInterface(new SpeechBridge(), "AndroidSpeech");
        webView.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !isLocal(request);
            }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                if (!isLocal(request)) return empty(403, "Forbidden");
                String path = request.getUrl().getPath();
                if (path == null || "/".equals(path)) path = "/index.html";
                if (path.contains("..") || path.contains("\\")) return empty(403, "Forbidden");
                try {
                    InputStream input = getAssets().open("www" + path);
                    String mime = path.endsWith(".html") ? "text/html" : path.endsWith(".js") ? "text/javascript" : path.endsWith(".css") ? "text/css" : path.endsWith(".woff2") ? "font/woff2" : "application/octet-stream";
                    return new WebResourceResponse(mime, mime.startsWith("text/") ? "UTF-8" : null, input);
                } catch (IOException e) { return empty(404, "Not Found"); }
            }
        });
        setContentView(webView);
        webView.loadUrl("https://" + HOST + "/index.html");
    }
    private static boolean isLocal(WebResourceRequest request) {
        return "https".equals(request.getUrl().getScheme()) && HOST.equals(request.getUrl().getHost()) && request.getUrl().getPort() == -1;
    }
    private static WebResourceResponse empty(int code, String reason) {
        return new WebResourceResponse("text/plain", "UTF-8", code, reason, java.util.Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
    }
    private final class SpeechBridge {
        @JavascriptInterface public void speak(String text) {
            if (text == null || !text.matches("[A-Za-z ]{1,60}")) return;
            runOnUiThread(() -> { if (speechReady) speech.speak(text, TextToSpeech.QUEUE_FLUSH, null, "word"); });
        }
    }
    @Override public void onBackPressed() {
        webView.evaluateJavascript("(()=>{const e=document.querySelector('[data-action=close-dialog], [data-action=quit], [data-action=finish]');if(e){e.click();return 'handled';}const n=document.querySelector('[data-view=learn]');if(n&&!n.classList.contains('active')){n.click();return 'handled';}return 'exit';})()", result -> { if ("\"exit\"".equals(result)) finish(); });
    }
    @Override protected void onDestroy() {
        if (speech != null) { speech.stop(); speech.shutdown(); }
        if (webView != null) { webView.removeJavascriptInterface("AndroidSpeech"); webView.destroy(); }
        super.onDestroy();
    }
}
