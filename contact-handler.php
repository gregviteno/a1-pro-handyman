<?php
/**
 * A1 Pro Handyman — lead form handler (SiteGround / Apache / PHP mail()).
 *
 * Every form on the site POSTs here. Validates, filters spam, emails the
 * lead with full ad attribution, then redirects to /thank-you.html where
 * the Google Ads + Meta conversion tags fire.
 *
 * NOTE: If SiteGround mail() proves unreliable, swap the form `action` on
 * every page to a Web3Forms/Formspree endpoint — keep the thank-you
 * redirect either way (both services support a redirect/return URL).
 */

// TODO(GREG): leads email — confirm leads@a1prohandyman.com inbox exists before launch.
$LEADS_EMAIL = 'leads@a1prohandyman.com';
$FROM_EMAIL  = 'forms@a1prohandyman.com'; // same-domain sender helps deliverability

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /contact.html');
    exit;
}

function clean($key, $max = 300) {
    $v = isset($_POST[$key]) ? trim((string) $_POST[$key]) : '';
    $v = str_replace(["\r", "\n"], ' ', $v); // header-injection guard
    return mb_substr(strip_tags($v), 0, $max);
}

/* ---------- Spam traps ---------- */

// 1. Honeypot: hidden via CSS; humans never fill it.
if (clean('company_website') !== '') {
    header('Location: /thank-you.html'); // pretend success, drop silently
    exit;
}

// 2. Minimum time on page: tracking.js stamps load time (epoch seconds).
//    Empty means JS is off — allow it (forms must work without JS).
$form_ts = clean('form_ts', 20);
if ($form_ts !== '' && ctype_digit($form_ts) && (time() - (int) $form_ts) < 3) {
    header('Location: /thank-you.html');
    exit;
}

/* ---------- Validate ---------- */

$name    = clean('name', 120);
$phone   = clean('phone', 40);
$message = mb_substr(strip_tags(trim((string) ($_POST['message'] ?? ''))), 0, 3000);

if ($name === '' || $phone === '') {
    // Required fields missing (client validation bypassed) — bounce back.
    header('Location: /contact.html');
    exit;
}

/* ---------- Build the lead email ---------- */

$fields = [
    'Name'        => $name,
    'Phone'       => $phone,
    'Email'       => clean('email', 200),
    'Street'      => clean('street', 200),
    'City'        => clean('city', 100),
    'State'       => clean('state', 10),
    'Zip'         => clean('zip', 12),
    'Timeline'    => clean('timeline', 60),
    'Project'     => $message,
];

$tracking = [
    'Source page'  => clean('source_page', 200),
    'Landing page' => clean('landing_page', 500),
    'Referrer'     => clean('referrer', 500),
    'utm_source'   => clean('utm_source'),
    'utm_medium'   => clean('utm_medium'),
    'utm_campaign' => clean('utm_campaign'),
    'utm_term'     => clean('utm_term'),
    'utm_content'  => clean('utm_content'),
    'gclid'        => clean('gclid'),
    'fbclid'       => clean('fbclid'),
];

$urgent  = stripos($fields['Timeline'], 'today') !== false;
$subject = ($urgent ? '[TODAY] ' : '') . 'New lead: ' . $name . ' — ' . $phone;

$body = "NEW LEAD — A1 Pro Handyman\n";
$body .= str_repeat('=', 40) . "\n\n";
foreach ($fields as $label => $value) {
    if ($value !== '') $body .= sprintf("%-14s %s\n", $label . ':', $value);
}
$body .= "\n--- Attribution ---\n";
foreach ($tracking as $label => $value) {
    if ($value !== '') $body .= sprintf("%-14s %s\n", $label . ':', $value);
}
$body .= "\nReceived: " . date('Y-m-d H:i:s T') . "\n";

$headers = [
    'From: A1 Pro Handyman Website <' . $FROM_EMAIL . '>',
    'Reply-To: ' . ($fields['Email'] !== '' ? $fields['Email'] : $FROM_EMAIL),
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8',
];

@mail($LEADS_EMAIL, $subject, $body, implode("\r\n", $headers));

/* ---------- Done: to the conversion page ---------- */
header('Location: /thank-you.html');
exit;
