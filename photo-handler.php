<?php
/**
 * A1 Pro Handyman — photo attachment handler (SiteGround / Apache / PHP mail()).
 *
 * WHY THIS EXISTS: Formspree's free plan rejects any submission carrying a
 * file, and because js/main.js POSTs the whole form at once, one optional
 * photo was failing the ENTIRE lead — the customer saw "Something went wrong"
 * and we lost the name, phone, and job details along with the photo.
 *
 * js/main.js now strips the photo out of the Formspree POST (so the lead
 * always lands) and sends the file here instead, as a second email that
 * references the lead by name/phone so the two can be matched up in the inbox.
 *
 * The upload is NEVER written into the web root — it is read straight from
 * PHP's temp dir, base64'd into the message, and discarded when the request
 * ends. There is no uploads directory to harden and nothing to serve back.
 */

// Keep this matching the inbox the Formspree form delivers to, otherwise the
// lead lands in one mailbox and its photo in another.
$LEADS_EMAIL = 'estimatingdept@a1prohandyman.com';
$FROM_EMAIL  = 'forms@a1prohandyman.com'; // same-domain sender helps deliverability

$MAX_BYTES    = 10485760; // 10 MB — matches the client-side cap in js/main.js
$RATE_MAX     = 12;       // most uploads per IP per hour
$RATE_WINDOW  = 3600;

// Detected type => extension. The client-supplied filename and MIME type are
// never trusted; the extension below comes from finfo's read of the bytes.
$ALLOWED = [
    'image/jpeg'      => 'jpg',
    'image/png'       => 'png',
    'image/webp'      => 'webp',
    'image/gif'       => 'gif',
    'image/heic'      => 'heic',
    'image/heif'      => 'heic',
    'application/pdf' => 'pdf',
];

header('Content-Type: application/json; charset=UTF-8');

function respond($ok, $error = '', $code = 200) {
    http_response_code($code);
    echo json_encode($error === '' ? ['ok' => $ok] : ['ok' => $ok, 'error' => $error]);
    exit;
}

function clean($key, $max = 300) {
    $v = isset($_POST[$key]) ? trim((string) $_POST[$key]) : '';
    $v = str_replace(["\r", "\n"], ' ', $v); // header-injection guard
    return mb_substr(strip_tags($v), 0, $max);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'post-only', 405);
}

/* ---------- Origin check ----------
   Deliberately fail-OPEN when neither header is present: some privacy browsers
   strip Referer, and the recipient address is hardcoded above, so the worst a
   forged request can do is mail the owner — which the honeypot and rate limit
   below already cover. Losing a real customer's photo is the costlier failure. */
$origin = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
if ($origin !== '') {
    $host = strtolower((string) parse_url($origin, PHP_URL_HOST));
    if ($host !== 'a1prohandyman.com' && $host !== 'www.a1prohandyman.com') {
        respond(false, 'bad-origin', 403);
    }
}

/* ---------- Spam traps (mirrors contact-handler.php) ---------- */

if (clean('_gotcha') !== '' || clean('company_website') !== '') {
    respond(true); // pretend success, drop silently
}

$form_ts = clean('form_ts', 20);
if ($form_ts !== '' && ctype_digit($form_ts) && (time() - (int) $form_ts) < 3) {
    respond(true);
}

/* ---------- Rate limit: stop a script flooding the inbox with attachments ---------- */

$ip    = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$stamp = sys_get_temp_dir() . '/a1ph_' . hash('sha256', $ip) . '.txt';
$hits  = [];
if (is_readable($stamp)) {
    $hits = array_filter(
        explode(',', (string) file_get_contents($stamp)),
        function ($t) use ($RATE_WINDOW) { return ctype_digit(trim($t)) && (time() - (int) $t) < $RATE_WINDOW; }
    );
}
if (count($hits) >= $RATE_MAX) {
    respond(false, 'rate-limited', 429);
}
$hits[] = time();
@file_put_contents($stamp, implode(',', $hits), LOCK_EX);

/* ---------- Validate the upload ---------- */

if (!isset($_FILES['photo']) || !is_array($_FILES['photo'])) {
    respond(false, 'no-file', 400);
}
$f = $_FILES['photo'];

$err = $f['error'] ?? UPLOAD_ERR_NO_FILE;
if ($err !== UPLOAD_ERR_OK) {
    // INI_SIZE/FORM_SIZE mean the file beat PHP's own upload_max_filesize.
    $tooBig = in_array($err, [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true);
    respond(false, $tooBig ? 'too-large' : 'upload-failed', 400);
}
if (!is_uploaded_file($f['tmp_name'])) {
    respond(false, 'not-an-upload', 400);
}
if (($f['size'] ?? 0) <= 0 || $f['size'] > $MAX_BYTES) {
    respond(false, 'too-large', 413);
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime  = (string) $finfo->file($f['tmp_name']);
if (!isset($ALLOWED[$mime])) {
    respond(false, 'bad-type', 415);
}

$data = @file_get_contents($f['tmp_name']);
if ($data === false || $data === '') {
    respond(false, 'read-failed', 500);
}

/* Rebuild the filename from scratch rather than sanitizing theirs — the only
   customer-controlled part is the stem, stripped to a safe character set. */
$stem = pathinfo((string) ($f['name'] ?? 'photo'), PATHINFO_FILENAME);
$stem = preg_replace('/[^A-Za-z0-9._-]/', '_', (string) $stem);
$stem = trim(mb_substr((string) $stem, 0, 60), '._-');
if ($stem === '') $stem = 'photo';
$filename = $stem . '.' . $ALLOWED[$mime];

/* ---------- Who is this photo for? ---------- */

$name  = clean('name', 120);
$phone = clean('phone', 40);
$email = clean('email', 200);
$label = $name !== '' ? $name : 'unknown customer';
if ($phone !== '') $label .= ' — ' . $phone;

$body = "PHOTO FOR A WEBSITE LEAD\n";
$body .= str_repeat('=', 40) . "\n\n";
$body .= "This is the photo attached to a lead form. The lead itself arrives\n";
$body .= "in a separate email from Formspree — match them on name/phone.\n\n";
foreach ([
    'Name'        => $name,
    'Phone'       => $phone,
    'Email'       => $email,
    'Zip'         => clean('zip', 12),
    'Form'        => clean('form_id', 80),
    'Source page' => clean('source_page', 200),
    'gclid'       => clean('gclid'),
] as $k => $v) {
    if ($v !== '') $body .= sprintf("%-14s %s\n", $k . ':', $v);
}
$body .= sprintf("%-14s %s (%s KB)\n", 'File:', $filename, number_format(strlen($data) / 1024, 0));
$body .= "\nReceived: " . date('Y-m-d H:i:s T') . "\n";

/* ---------- Send as a MIME multipart with the photo attached ---------- */

$boundary = '=_a1' . bin2hex(random_bytes(16));
$eol      = "\r\n";

$headers = implode($eol, [
    'From: A1 Pro Handyman Website <' . $FROM_EMAIL . '>',
    'Reply-To: ' . ($email !== '' ? $email : $FROM_EMAIL),
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
    'X-Mailer: PHP/' . phpversion(),
]);

$message  = '--' . $boundary . $eol;
$message .= 'Content-Type: text/plain; charset=UTF-8' . $eol;
$message .= 'Content-Transfer-Encoding: 8bit' . $eol . $eol;
$message .= $body . $eol;
$message .= '--' . $boundary . $eol;
$message .= 'Content-Type: ' . $mime . '; name="' . $filename . '"' . $eol;
$message .= 'Content-Transfer-Encoding: base64' . $eol;
$message .= 'Content-Disposition: attachment; filename="' . $filename . '"' . $eol . $eol;
$message .= chunk_split(base64_encode($data), 76, $eol);
$message .= '--' . $boundary . '--' . $eol;

$subject = 'Photo for lead: ' . $label;

if (!@mail($LEADS_EMAIL, $subject, $message, $headers)) {
    respond(false, 'mail-failed', 500);
}

respond(true);
