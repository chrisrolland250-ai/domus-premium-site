<?php
// -------------------- CONFIG --------------------
$to = "contact@domuspremium.fr"; // <-- remplace par ton email de réception
$domain_from = "domuspremium.fr"; // utilisé pour l'adresse From technique
$redirect_ok = "merci.html";      // page de redirection en cas de succès
// ------------------------------------------------

// Only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  exit('Méthode non autorisée.');
}

// Honeypot anti-bot
if (!empty($_POST['website'])) {
  // silencieux : on fait comme si tout allait bien
  header("Location: " . $redirect_ok);
  exit;
}

// Collect & sanitize
$name    = trim($_POST['from_name'] ?? '');
$email   = trim($_POST['reply_to'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$subject = trim($_POST['subject'] ?? 'Message depuis Domus Premium');
$message = trim($_POST['message'] ?? '');

// Basic validation
if ($name === '' || $email === '' || $message === '') {
  http_response_code(422);
  exit('Champs requis manquants.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(422);
  exit('Email invalide.');
}

// Build email body (plain text)
$body  = "Nouveau message depuis le formulaire Domus Premium\n\n";
$body .= "Nom      : {$name}\n";
$body .= "Email    : {$email}\n";
if ($phone !== '') $body .= "Téléphone: {$phone}\n";
$body .= "Sujet    : {$subject}\n\n";
$body .= "Message:\n{$message}\n";

// Headers
$from = "noreply@".$domain_from;
$headers  = "From: Domus Premium <{$from}>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Try sending
$sent = @mail($to, "Domus Premium • " . $subject, $body, $headers);

if ($sent) {
  header("Location: " . $redirect_ok);
  exit;
} else {
  http_response_code(500);
  echo "Erreur : impossible d'envoyer le message. Contactez-nous par téléphone.";
}
?>
