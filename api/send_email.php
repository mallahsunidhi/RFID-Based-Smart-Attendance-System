<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php'; // Must exist: run composer install if missing

function sendEmail($to, $studentName) {
    $mail = new PHPMailer(true);

    try {
        // ✅ SMTP configuration
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'mallahsunidhi@gmail.com'; // ✅ your Gmail
        $mail->Password = 'nmka swbh lerf ymtp';     // ✅ your Gmail App Password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // More stable than 'tls'
        $mail->Port = 587;

        // ✅ Sender (same as username to avoid spam issues)
        $mail->setFrom('mallahsunidhi@gmail.com', 'RFID Attendance System');
        $mail->addAddress($to);

        // ✅ Message
        $mail->isHTML(true);
        $mail->Subject = "Attendance Recorded";
        $mail->Body = "Hello <b>$studentName</b>,<br>Your attendance has been successfully marked today.<br><br>Best Regards,<br><b>RFID Attendance System</b>";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email failed: " . $mail->ErrorInfo);
        return false;
    }
}
?>
