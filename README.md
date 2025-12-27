# Capacitor Bridge (Blazor WASM)

This project is a **Proof of Concept (PoC)** demonstrating a "Host-Decoupling" architecture. It separates the native host (Android/iOS) from the UI logic by using Blazor WebAssembly within a Capacitor shell. This approach reduces dependency friction often found in complex hybrid frameworks like MAUI.

## 🚀 Validated Features

- **Blazor WASM Integration:** Core UI and business logic run on standard WebAssembly.
- **Native Bridge:** High-performance hardware access (Battery, Device Info, UUID) via JavaScript Interop to Capacitor plugins.
- **Intelligent Web Fallback:** Full debugging support in Windows/Browser environments by accessing real Browser APIs (Battery API, UserAgent, Navigator) when native Capacitor plugins are unavailable.

## 🛠️ Project Update Workflow

When you make changes to the C# code or Razor components, follow these steps to deploy the update to your physical device.

### 1. Publish the Web Assets

Instead of a simple build, you must perform a full **Publish** to ensure all WASM assets are optimized and the `cap.js` is correctly placed.

- **In Visual Studio:** Right-click the Project → **Publish**.
- **Target:** Folder Profile.
- **Note:** Ensure your `capacitor.config.json` points to the publish directory:  
  `"webDir": "bin/Release/net9.0/browser-wasm/publish/wwwroot"`

> [!IMPORTANT]  
> Use the Visual Studio UI for publishing if you have specific folder profile configurations. Manual CLI commands might miss critical asset bundling steps.

### 2. Synchronize with Capacitor

Open a terminal (PowerShell) in the project root and run:
```powershell
npx cap sync android
```

This command copies the fresh `wwwroot` files from your Blazor publish folder into the native Android project.

### 3. Deploy to Native Host

- **Android:** Open the project in Android Studio. Click the **Green Play Button** to install the new version on your connected device.
- **iOS:** Synchronize your changes (e.g., via GitHub), open the workspace in Xcode, and run it on your iPhone/iPad.

## 🏗️ Architecture: Why Host-Decoupling?

As discussed https://github.com/dotnet/aspnetcore/discussions/64871 in the official ASP.NET Core community, this setup offers:

1. **Resilience:** Breaking changes in native SDKs (Xcode/Android) won't break your entire C# build environment.
2. **Performance:** Blazor WASM runs at near-native speed within the high-performance WebView.
3. **Maintainability:** Clear separation between Web-Standard UI and Native-Plugin hardware access.

## ⚖️ Architectural Challenges & Trade-offs

Moving from a tightly coupled framework like MAUI to a decoupled Blazor-Capacitor architecture involves specific trade-offs. Understanding these is key to a successful implementation.

### 1. The "JavaScript Tax" vs. Native C#
* **Challenge:** In MAUI, native logic is written in C#. With Capacitor, any native functionality must be bridged via **JavaScript**. This requires a context switch between languages during development.
* **Benefit:** You gain a **Clean Interface**. Capacitor enforces a "Parameters In / Parameters Out" pattern. This prevents "spaghetti code" where native logic is deeply tangled with UI logic. If the JS contract is solid, the app is stable.

### 2. Synchronization Effort
* **Challenge:** You maintain a **Double-Sided Model**. Every new hardware feature requires an update in both the `cap.js` bridge and the C# `DeviceResult` class.
* **Benefit:** This forced discipline leads to a **Platform-Agnostic Core**. Your Blazor logic doesn't care if it runs on Android, iOS, or a Windows Browser; it simply talks to an interface.

### 3. Project Simplicity vs. Multi-Project Overhead
* **MAUI/WPF Approach:** Often results in "Project Hell"—multiple platform-specific projects (Android, iOS, WinUI/WPF) with complex `#if ANDROID` or `#if WINDOWS` directives.
* **Capacitor Approach:** You maintain a **single Blazor WASM project**. Whether you target Mobile (Capacitor), Web (Standard Browser), or Desktop (WebView2/Electron), the C# codebase remains 100% identical. The hardware abstraction is shifted to the thin JS layer.

### 4. Debugging & Lifecycle
* **Debugging:** You now operate two debuggers. C# logic is handled in Visual Studio, while Bridge/Native issues are inspected via Chrome DevTools (Remote Debugging).
* **Lifecycle:** Unlike MAUI’s native events, app lifecycle changes (Pause/Resume) must be explicitly "fired" from JavaScript to Blazor to ensure tasks like your "Polling-Bridge" logic react correctly when the app is backgrounded.

### 🏁 **Final Conclusion**
My main pain point remains the necessity of JavaScript; however, with the rising productivity of AI tools, this weight is becoming increasingly negligible.

When compared to the MAUI alternative—where you live with the daily uncertainty that a new framework bug might block a critical customer update or app release—this architecture feels like a 'blessed world.' It restores a level of reliability and predictability that we used to take for granted in the days of Winforms and WPF. We trade the convenience of a single language for the peace of mind that comes with stable, web-standard-based deployments.
