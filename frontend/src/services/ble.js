/**
 * BLE attendance service.
 *
 * Web Bluetooth: browsers do NOT allow web pages to scan for beacons from
 * arbitrary devices without user gesture + supported API. Also, browsers
 * cannot broadcast. So:
 *  - Faculty running a session should use a supported Android companion app
 *    (to be built) or a dedicated BLE beacon that advertises the session token.
 *  - Students scan using Web Bluetooth if supported; otherwise we surface a
 *    manual fallback.
 *
 * This module only does what the browser actually allows. It never fakes
 * success.
 */

const SESSION_SERVICE_UUID = '0000fff0-0000-1000-8000-00805f9b34fb';

export const isBLESupported = () => typeof navigator !== 'undefined' && !!navigator.bluetooth;

export const requestDevice = async () => {
  if (!isBLESupported()) throw new Error('Bluetooth is not supported in this browser.');
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: [SESSION_SERVICE_UUID] }],
    optionalServices: [SESSION_SERVICE_UUID],
  });
  return device;
};

export const scanForSessionToken = async (expectedSessionId) => {
  if (!isBLESupported()) throw new Error('BLE not supported on this browser.');

  const device = await requestDevice();
  const server = await device.gatt.connect();
  const service = await server.getPrimaryService(SESSION_SERVICE_UUID);
  const char = await service.getCharacteristic('0000fff1-0000-1000-8000-00805f9b34fb');
  const data = await char.readValue();
  const text = new TextDecoder().decode(data);

  // Format: "SESSIONID:TOKEN:RSSI"
  const [sessionId, token, rssiStr] = text.split(':');
  if (sessionId !== expectedSessionId) {
    throw new Error('Beacon advertises a different session. Move closer to the classroom.');
  }
  const rssi = Number(rssiStr) || null;
  return { token, rssi, deviceInfo: device.name || 'BLE device' };
};

export const stopScan = async () => {};