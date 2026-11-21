<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Atur Ulang Kata Sandi - Crave HRM</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      color: #1e293b;
    }
    table {
      border-collapse: collapse;
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
      display: inline-block;
      font-weight: 700;
      font-size: 15px;
      line-height: 1.2;
      padding: 14px 32px;
      border-radius: 12px;
      text-align: center;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px rgba(27, 92, 254, 0.35);
    }
    .cta-button:hover {
      background-color: #1447cc !important;
    }
    @media only screen and (max-width: 600px) {
      .responsive-table {
        width: 100% !important;
      }
      .banner-padding {
        padding: 32px 20px !important;
      }
      .content-padding {
        padding: 28px 20px !important;
      }
      .cta-button {
        display: block !important;
        width: auto !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <!-- Outer Canvas Table (No restrictive box border / wrapper) -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; margin: 0; padding: 0;">
    <tr>
      <td align="center" style="padding: 0;">

        <!-- Main Email Structure (Fluid Max 600px) -->
        <table role="presentation" class="responsive-table" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; margin: 0 auto;">
          
          <!-- ============================================== -->
          <!-- 1. FULL-WIDTH HERO BANNER (CRAVE ROYAL BLUE)   -->
          <!-- ============================================== -->
          <tr>
            <td class="banner-padding" style="background: linear-gradient(135deg, #1B5CFE 0%, #0D44D4 100%); padding: 40px 36px; text-align: left;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <!-- Logo & Brand Header -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td valign="middle" style="padding-right: 14px;">
                          <img src="{{ $logoUrl ?? asset('dark-mode-logo.png') }}" alt="Crave Logo" width="44" height="44" style="width: 44px; height: 44px; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));" />
                        </td>
                        <td valign="middle">
                          <span style="font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff; line-height: 1; display: inline-block;">
                            Crave <span style="color: #93C5FD; font-weight: 900;">HRM</span>
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 28px;">
                    <!-- Banner Title & Security Badge -->
                    <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.16); color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 5px 12px; border-radius: 9999px; margin-bottom: 12px;">
                      Autentikasi &amp; Keamanan Akun
                    </div>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; line-height: 1.25;">
                      Atur Ulang Kata Sandi
                    </h1>
                    <p style="margin: 8px 0 0 0; font-size: 14px; color: rgba(255, 255, 255, 0.9); line-height: 1.5;">
                      Permintaan pemulihan akses masuk akun portal Crave HRM Anda
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============================================== -->
          <!-- 2. EMAIL BODY CONTENT                          -->
          <!-- ============================================== -->
          <tr>
            <td class="content-padding" style="background-color: #ffffff; padding: 36px 36px 32px 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <!-- Greeting -->
                <tr>
                  <td style="font-size: 16px; font-weight: 700; color: #0f172a; padding-bottom: 14px;">
                    Halo, {{ $name ?? 'Pengguna Crave HRM' }}!
                  </td>
                </tr>
                <!-- Explanation -->
                <tr>
                  <td style="font-size: 14px; line-height: 1.65; color: #334155; padding-bottom: 24px;">
                    Kami menerima permintaan pengaturan ulang kata sandi untuk akun Crave HRM yang terdaftar dengan email <strong style="color: #0f172a;">{{ $email }}</strong>. Silakan klik tombol di bawah ini untuk membuat kata sandi baru:
                  </td>
                </tr>
                <!-- CTA Button -->
                <tr>
                  <td align="center" style="padding-bottom: 28px;">
                    <a href="{{ $resetUrl }}" target="_blank" class="cta-button" style="background-color: #1B5CFE; color: #ffffff; display: inline-block; font-weight: 700; font-size: 15px; line-height: 1.2; padding: 14px 34px; border-radius: 12px; text-align: center; text-decoration: none;">
                      Atur Ulang Kata Sandi
                    </a>
                  </td>
                </tr>
                <!-- Security Advisory Info -->
                <tr>
                  <td style="background-color: #F8FAFC; border-left: 4px solid #1B5CFE; padding: 14px 18px; border-radius: 0 10px 10px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size: 12px; line-height: 1.55; color: #475569;">
                          <strong style="color: #1e293b;">Catatan Keamanan:</strong>
                          <ul style="margin: 6px 0 0 0; padding-left: 18px; color: #64748b;">
                            <li>Tautan ini bersifat rahasia dan akan kedaluwarsa dalam <strong>60 menit</strong>.</li>
                            <li>Jika Anda tidak meminta perubahan kata sandi, abaikan email ini dan kata sandi Anda tetap aman.</li>
                          </ul>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Fallback URL -->
                <tr>
                  <td style="padding-top: 24px; font-size: 11px; line-height: 1.6; color: #94a3b8; word-break: break-all;">
                    Jika tombol di atas tidak dapat diklik, salin dan tempel URL berikut pada peramban (browser) Anda:<br>
                    <a href="{{ $resetUrl }}" style="color: #1B5CFE; text-decoration: underline;">{{ $resetUrl }}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============================================== -->
          <!-- 3. FOOTER                                      -->
          <!-- ============================================== -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 24px 36px; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="font-size: 12px; font-weight: 600; color: #64748b; padding-bottom: 4px;">
                    Crave HRM — Solusi Cloud HR &amp; Payroll Terpadu Indonesia
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 11px; color: #94a3b8; line-height: 1.5;">
                    Domain Resmi: <a href="https://hrm.craveservices.my.id" style="color: #1B5CFE; text-decoration: none;">hrm.craveservices.my.id</a><br>
                    Email ini dibuat secara otomatis oleh sistem, mohon untuk tidak membalas email ini.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
