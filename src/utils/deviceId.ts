import { v7 as uuidv7 } from "uuid";
const DEVICE_ID_KEY = "device_id";

export function getDeviceId(): string {
  if (typeof window === "undefined") return "";

  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = uuidv7();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}

export function clearDeviceId() {
  localStorage.removeItem(DEVICE_ID_KEY);
}
