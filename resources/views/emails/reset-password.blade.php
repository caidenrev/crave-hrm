<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Atur Ulang Kata Sandi - Crave HRM</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');
    
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      min-width: 100% !important;
      background-color: #ffffff !important;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      color: #1e293b;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      border: 0;
      outline: none;
      text-decoration: none;
      display: block;
    }
    a {
      text-decoration: none;
    }
    .cta-button {
      background-color: #1B5CFE;
      color: #ffffff !important;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
      display: inline-block;
      font-weight: 800;
      font-size: 15px;
      line-height: 1.2;
      padding: 16px 38px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 6px 20px rgba(27, 92, 254, 0.35);
      transition: all 0.2s ease;
    }
    .cta-button:hover {
      background-color: #1447cc !important;
    }
    @media only screen and (max-width: 640px) {
      .banner-cell {
        padding: 40px 20px 36px 20px !important;
      }
      .content-cell {
        padding: 36px 20px 32px 20px !important;
      }
      .footer-cell {
        padding: 28px 20px !important;
      }
      .cta-button {
        display: block !important;
        width: auto !important;
        padding: 16px 24px !important;
      }
      .brand-title {
        font-size: 24px !important;
      }
      .banner-heading {
        font-size: 24px !important;
      }
    }
  </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; width: 100% !important; min-width: 100% !important; background-color: #ffffff !important; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;">

  @php
    // Prioritas 1: Embed gambar inline (CID) agar Gmail/Outlook tidak memblokir atau butuh fetch localhost
    // Prioritas 2: Public URL HTTPS resmi hrm.craveservices.my.id
    $logoSrc = 'https://hrm.craveservices.my.id/dark-mode-logo.png';
    if (isset($message)) {
      try {
        $logoPath = public_path('dark-mode-logo.png');
        if (file_exists($logoPath)) {
          $logoSrc = $message->embed($logoPath);
        }
      } catch (\Throwable $e) {
        $logoSrc = 'https://hrm.craveservices.my.id/dark-mode-logo.png';
      }
    }
  @endphp

  <!-- FULL-WIDTH EMAIL CANVAS (100% Edge-to-Edge Desktop, Tablet, Mobile) -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100% !important; min-width: 100% !important; margin: 0; padding: 0; border: none; border-collapse: collapse; background-color: #ffffff;">

    <!-- ============================================== -->
    <!-- 1. FULL-WIDTH HERO BANNER (100% LEBAR LAYAR)   -->
    <!-- ============================================== -->
    <tr>
      <td class="banner-cell" align="center" style="width: 100% !important; background-color: #1B5CFE; background: linear-gradient(135deg, #1B5CFE 0%, #0D44D4 100%); padding: 56px 32px 52px 32px; margin: 0; border: none;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 760px; width: 100%; margin: 0 auto; text-align: left;">
          <tr>
            <td>
              <!-- Logo + Title Lockup -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="padding-right: 14px;">
                    <img src="{{ $logoSrc }}" alt="Crave Logo" width="46" height="46" style="width: 46px; height: 46px; object-fit: contain; display: block; border: 0;" />
                  </td>
                  <td valign="middle">
                    <span class="brand-title" style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 28px; font-weight: 900; letter-spacing: -0.6px; color: #ffffff; line-height: 1; display: inline-block;">
                      Crave <span style="color: #93C5FD; font-weight: 900;">HRM</span>
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 32px;">
              <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.18); color: #ffffff; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.9px; padding: 6px 14px; border-radius: 9999px; margin-bottom: 14px;">
                Autentikasi &amp; Keamanan Akun
              </div>
              <h1 class="banner-heading" style="margin: 0; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 30px; font-weight: 900; color: #ffffff; letter-spacing: -0.8px; line-height: 1.2;">
                Atur Ulang Kata Sandi
              </h1>
              <p style="margin: 10px 0 0 0; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 15px; color: rgba(255, 255, 255, 0.92); line-height: 1.55; font-weight: 500;">
                Permintaan pemulihan akses masuk akun portal Crave HRM Anda
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ============================================== -->
    <!-- 2. FULL-WIDTH BODY CONTENT                     -->
    <!-- ============================================== -->
    <tr>
      <td class="content-cell" align="center" style="width: 100% !important; background-color: #ffffff; padding: 48px 32px 44px 32px; margin: 0; border: none;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 760px; width: 100%; margin: 0 auto; text-align: left;">
          <!-- Salutation -->
          <tr>
            <td style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 18px; font-weight: 800; color: #0f172a; padding-bottom: 16px; letter-spacing: -0.3px;">
              Halo, {{ $name ?? 'Pengguna Crave HRM' }}!
            </td>
          </tr>
          <!-- Body Text -->
          <tr>
            <td style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 15px; line-height: 1.7; color: #334155; padding-bottom: 28px; font-weight: 400;">
              Kami menerima permintaan pengaturan ulang kata sandi untuk akun Crave HRM yang terdaftar dengan email <strong style="color: #0f172a; font-weight: 700;">{{ $email }}</strong>. Silakan klik tombol di bawah ini untuk membuat kata sandi baru:
            </td>
          </tr>
          <!-- Action Button -->
          <tr>
            <td style="padding-bottom: 36px;">
              <a href="{{ $resetUrl }}" target="_blank" class="cta-button" style="background-color: #1B5CFE; color: #ffffff !important; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-weight: 800; font-size: 15px; line-height: 1.2; padding: 16px 38px; border-radius: 12px; text-align: center; text-decoration: none; display: inline-block;">
                Atur Ulang Kata Sandi
              </a>
            </td>
          </tr>
          <!-- Security Box -->
          <tr>
            <td style="background-color: #F8FAFC; border-left: 4px solid #1B5CFE; padding: 18px 22px; border-radius: 0 12px 12px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 13px; line-height: 1.6; color: #475569;">
                    <strong style="color: #0f172a; font-weight: 800;">Catatan Keamanan:</strong>
                    <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #64748b;">
                      <li style="margin-bottom: 4px;">Tautan ini bersifat rahasia dan akan kedaluwarsa otomatis dalam <strong>60 menit</strong>.</li>
                      <li>Jika Anda tidak merasa melakukan permintaan ini, abaikan email ini dan kata sandi Anda akan tetap aman.</li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Fallback URL -->
          <tr>
            <td style="padding-top: 32px; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 12px; line-height: 1.65; color: #94a3b8; word-break: break-all;">
              Jika tombol di atas tidak dapat diklik, salin dan tempel tautan berikut ke peramban (browser) Anda:<br>
              <a href="{{ $resetUrl }}" style="color: #1B5CFE; text-decoration: underline; font-weight: 600;">{{ $resetUrl }}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ============================================== -->
    <!-- 3. FULL-WIDTH FOOTER                           -->
    <!-- ============================================== -->
    <tr>
      <td class="footer-cell" align="center" style="width: 100% !important; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 36px 32px; margin: 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 760px; width: 100%; margin: 0 auto; text-align: center;">
          <tr>
            <td align="center" style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 13px; font-weight: 700; color: #475569; padding-bottom: 6px;">
              Crave HRM — Solusi Cloud HR &amp; Payroll Terpadu Indonesia
            </td>
          </tr>
          <tr>
            <td align="center" style="font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-size: 12px; color: #94a3b8; line-height: 1.6;">
              Domain Layanan: <a href="https://hrm.craveservices.my.id" style="color: #1B5CFE; text-decoration: none; font-weight: 600;">hrm.craveservices.my.id</a><br>
              Email ini dibuat secara otomatis oleh sistem keamanan Crave HRM. Mohon untuk tidak membalas email ini secara langsung.
            </td>
          </tr>
        </table>
      </td>
    </tr>

  </table>

</body>
</html>
