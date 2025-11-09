/*
  RFID Attendance System with ESP32 + MFRC522
  Sends UID to PHP API via HTTP GET
  Includes Invalid Card Detection
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 5    // SDA pin on MFRC522
#define RST_PIN 22  // RST pin on MFRC522
MFRC522 mfrc522(SS_PIN, RST_PIN);

// ✅ WiFi Credentials
const char* ssid = "ESP32Network";
const char* password = "12345678";

// ✅ API Endpoint (change IP to your PC running XAMPP)
String serverName = "http://192.168.137.1/rfid_attendance_system/api/save_attendance.php?uid=";

// ✅ Valid Card UIDs (ADD YOUR OWN)
String validUIDs[] = {
  "CB98A13B",   // Card 1
  "D31433DA",   // Card 2
  "A12F43BC",   // Card 3 (example)
  "B34C29DE"    // Add more if needed
};
int totalValid = sizeof(validUIDs) / sizeof(validUIDs[0]);

void setup() {
  Serial.begin(115200);
  SPI.begin();
  mfrc522.PCD_Init();
  delay(1000);
  Serial.println("Initializing RFID Attendance System...");

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi...");
  
  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 20) {
    delay(1000);
    Serial.print(".");
    retries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n❌ Failed to connect to WiFi!");
  }

  Serial.println("Scan your RFID card...");
}

void loop() {
  // Look for new cards
  if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial()) {
    delay(50);
    return;
  }

  // Get UID
  String uid = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    uid += String(mfrc522.uid.uidByte[i], HEX);
  }
  uid.toUpperCase();

  Serial.print("Card UID: ");
  Serial.println(uid);

  // ✅ Check if UID is valid
  bool isValid = false;
  for (int i = 0; i < totalValid; i++) {
    if (uid == validUIDs[i]) {
      isValid = true;
      break;
    }
  }

  if (!isValid) {
    Serial.println("❌ INVALID CARD SCANNED!");
    mfrc522.PICC_HaltA();
    delay(2000);
    return;
  }

  // ✅ If valid, send data to server
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String fullURL = serverName + uid;
    Serial.print("Posting: ");
    Serial.println(fullURL);

    http.begin(fullURL);
    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
      String payload = http.getString();
      Serial.print("✅ Server Response: ");
      Serial.println(payload);
    } else {
      Serial.print("❌ POST failed, error: ");
      Serial.println(http.errorToString(httpResponseCode));
    }

    http.end();
  } else {
    Serial.println("⚠ WiFi not connected!");
  }

  // Halt PICC and delay before next read
  mfrc522.PICC_HaltA();
  delay(2000);
}
