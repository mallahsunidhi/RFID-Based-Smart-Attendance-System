<?php
/**
 * sendSMS.php
 * Sends SMS via Fast2SMS Quick SMS API (non-DLT)
 */

function sendSMS($phoneNumber, $message) {
    // ✅ Validate 10-digit phone number
    if (!preg_match('/^\d{10}$/', $phoneNumber)) {
        error_log("❌ Invalid phone number: $phoneNumber");
        return false;
    }

    // 🔑 Your Fast2SMS API key
    $apiKey = "aN7JTUtnEfv5p4OeljxYGZoq1gWcPzy2wBDKXm96dI8ikHSb3L7EAr5sUb2WZ3IBm9Rp0cu8SjPkV1yn";

    // ✅ Use Quick SMS route (for normal messages, not DLT)
    $route = "q";

    // ✅ Prepare the data
    $data = [
        "route" => $route,
        "sender_id" => "FSTSMS",   // Default sender for Quick SMS
        "message" => $message,
        "language" => "english",
        "numbers" => $phoneNumber
    ];

    // ✅ Initialize cURL
    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => "https://www.fast2sms.com/dev/bulkV2",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYHOST => 0,
        CURLOPT_SSL_VERIFYPEER => 0,
        CURLOPT_HTTPHEADER => [
            "authorization: $apiKey",
            "accept: */*",
            "cache-control: no-cache",
            "content-type: application/json"
        ],
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data)
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    // ✅ Debug log
    error_log("📩 SMS Debug Info:");
    error_log("Phone: $phoneNumber");
    error_log("Message: $message");
    error_log("HTTP Code: $httpCode");
    error_log("cURL Error: $err");
    error_log("API Response: " . $response);

    if ($err) {
        error_log("❌ SMS sending failed: " . $err);
        return false;
    }

    // ✅ Decode and verify Fast2SMS response
    $resData = json_decode($response, true);

    if (isset($resData['return']) && $resData['return'] === true) {
        error_log("✅ SMS sent successfully to $phoneNumber");
        return true;
    } else {
        error_log("❌ SMS failed for $phoneNumber. Full response: " . $response);
        return false;
    }
}
?>
