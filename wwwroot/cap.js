// cap.js - Comprehensive device information for Native and Web
window.capacitorInterop = {
    getDeviceInfo: async () => {
        console.log("Capacitor-Bridge: Fetching full device info...");

        const isNative = window.hasOwnProperty('Capacitor') && window.Capacitor.isNativePlatform();

        if (isNative) {
            try {
                // Native path via Capacitor Plugins
                const { Device } = await import('@capacitor/device');

                const info = await Device.getInfo();
                const battery = await Device.getBatteryInfo();
                const idResult = await Device.getId();
                const langResult = await Device.getLanguageCode();

                return {
                    model: info.model,
                    platform: info.platform,
                    osVersion: info.osVersion,
                    manufacturer: info.manufacturer,
                    batteryLevel: battery.batteryLevel,
                    isCharging: battery.isCharging,
                    uuid: idResult.identifier,
                    language: langResult.value,
                    isNative: true
                };
            } catch (e) {
                console.error("Native Bridge Error:", e);
            }
        }

        // --- ENHANCED WEB FALLBACK (Visual Studio / Windows Debugging) ---
        console.log("Capacitor-Bridge: Starting detailed Web-Detection...");

        // 1. Battery & Charging Status
        let webBattery = { level: 0.99, charging: true };
        try {
            if ('getBattery' in navigator) {
                const b = await navigator.getBattery();
                webBattery.level = b.level;
                webBattery.charging = b.charging;
            }
        } catch (e) { console.warn("Battery API not supported"); }

        // 2. OS & Vendor Detection
        const ua = navigator.userAgent;
        let os = "Unknown Web";
        let model = navigator.platform; // e.g., "Win32"

        if (/android/i.test(ua)) { os = "Android (Browser)"; model = "Mobile Device"; }
        else if (/iPad|iPhone|iPod/.test(ua)) { os = "iOS (Browser)"; model = "Apple Device"; }
        else if (/Win/.test(ua)) { os = "Windows"; model = "PC / Workstation"; }
        else if (/Mac/.test(ua)) { os = "MacOS"; model = "Macintosh"; }
        else if (/Linux/.test(ua)) { os = "Linux"; model = "Linux PC"; }

        // 3. Language & Virtual UUID for Web
        const webLang = navigator.language || navigator.userLanguage;

        // We generate a persistent-like ID for the session to mimic the UUID
        const webUuid = "WEB-" + btoa(navigator.userAgent).substring(0, 12);

        return {
            model: model,
            platform: "Web-Interface",
            osVersion: os,
            manufacturer: navigator.vendor || "Browser Vendor",
            batteryLevel: webBattery.level,
            isCharging: webBattery.charging,
            uuid: webUuid,
            language: webLang,
            isNative: false
        };
    }
};