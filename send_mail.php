<?php
$apiKey = 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;

$nom       = isset($_POST['nom']) ? trim($_POST['nom']) : '';
$email     = isset($_POST['email']) ? trim($_POST['email']) : '';
$telephone = isset($_POST['telephone']) ? trim($_POST['telephone']) : '';
$message   = isset($_POST['message']) ? nl2br(htmlspecialchars($_POST['message'])) : '';

if ($nom === '' || $email === '' || $message === '') {
    die('Veuillez remplir tous les champs obligatoires.');
}

$date = date('d/m/Y H:i');

$clientPayload = [
    'sender' => [
        'name'  => 'Domus Premium',
        'email' => 'domuspremium35@gmail.com'
    ],
    'to' => [
        ['email' => $email, 'name' => $nom]
    ],
    'replyTo' => [
        'email' => 'domuspremium35@gmail.com',
        'name'  => 'Domus Premium'
    ],
    'subject' => 'Domus Premium – Nous avons bien reçu votre demande',
    'htmlContent' => "
        <html><body>
        Bonjour {$nom},<br><br>
        Merci pour votre message !<br>
        Nous avons bien reçu votre demande et nous reviendrons vers vous sous 24 heures (hors week-end et jours fériés).<br><br>
        Récapitulatif de votre demande :<br>
        - Nom : {$nom}<br>
        - Email : {$email}<br>
        - Téléphone : {$telephone}<br>
        - Message : {$message}<br><br>
        À très bientôt,<br>
        <b>Domus Premium</b><br>
        Services à domicile – Rennes et alentours
        </body></html>
    "
];

$internePayload = [
    'sender' => [
        'name'  => 'Domus Premium',
        'email' => 'domuspremium35@gmail.com'
    ],
    'to' => [
        ['email' => 'domuspremium35@gmail.com', 'name' => 'Domus Premium']
    ],
    'subject' => '[Domus Premium] Nouvelle demande via le site',
    'htmlContent' => "
        <html><body>
        Nouvelle demande reçue via le formulaire du site :<br><br>
        - Nom : {$nom}<br>
        - Email : {$email}<br>
        - Téléphone : {$telephone}<br>
        - Message : {$message}<br>
        - Date : {$date}<br><br>
        Pense à rappeler le client dès que possible.
        </body></html>
    "
];

function sendBrevoEmail($apiKey, $payload) {
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, 'https://api.brevo.com/v3/smtp/email');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'Content-Type: application/json',
        'api-key: ' . $apiKey
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response  = curl_exec($ch);
    $httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($response === false || $httpCode >= 400) {
        error_log('Erreur Brevo: ' . $response);
        curl_close($ch);
        return false;
    }

    curl_close($ch);
    return true;
}

$okClient  = sendBrevoEmail($apiKey, $clientPayload);
$okInterne = sendBrevoEmail($apiKey, $internePayload);

if ($okClient && $okInterne) {
    echo 'Merci, votre demande a bien été envoyée. Domus Premium vous contactera rapidement.';
} else {
    echo "Une erreur est survenue lors de la tentative d'envoi de votre demande. Vous pouvez également nous contacter directement à domuspremium35@gmail.com.";
}
?>
