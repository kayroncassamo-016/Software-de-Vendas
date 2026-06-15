import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ServerConfig {
  host: string;
  port: string;
  database?: string;
  username?: string;
  password?: string;
}

const DEFAULT_CONFIG: ServerConfig = {
  host: "192.168.0.46",
  port: "8000",
};

export async function getServerConfig(): Promise<ServerConfig> {
  const data = await AsyncStorage.getItem("@server_config");

  if (!data) {
    return DEFAULT_CONFIG;
  }

  return JSON.parse(data);
}

export async function saveServerConfig(config: ServerConfig) {
  await AsyncStorage.setItem(
    "@server_config",
    JSON.stringify(config)
  );
}

export async function getApiBaseUrl() {
  const config = await getServerConfig();

  return `http://${config.host}:${config.port}/api/v1`;
}