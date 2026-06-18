const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withNetworkSecurity(config) {
  return withAndroidManifest(config, async (config) => {
    const manifest = config.modResults;

    if (!manifest.manifest["uses-permission"]) {
      manifest.manifest["uses-permission"] = [];
    }

    const hasInternet = manifest.manifest["uses-permission"].some(
      (perm) =>
        perm.$ && perm.$["android:name"] === "android.permission.INTERNET",
    );

    if (!hasInternet) {
      manifest.manifest["uses-permission"].push({
        $: { "android:name": "android.permission.INTERNET" },
      });
    }

    const hasNetwork = manifest.manifest["uses-permission"].some(
      (perm) =>
        perm.$ &&
        perm.$["android:name"] === "android.permission.ACCESS_NETWORK_STATE",
    );

    if (!hasNetwork) {
      manifest.manifest["uses-permission"].push({
        $: { "android:name": "android.permission.ACCESS_NETWORK_STATE" },
      });
    }

    if (
      manifest.manifest.application &&
      manifest.manifest.application.length > 0
    ) {
      const app = manifest.manifest.application[0];
      app.$["android:usesCleartextTraffic"] = "true";
      app.$["android:networkSecurityConfig"] = "@xml/network_security_config";
    }

    return config;
  });
};
