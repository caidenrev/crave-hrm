<?php

namespace Tests\Feature;

use App\Models\CanteenVendor;
use App\Models\CanteenVoucher;
use App\Models\Company;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Task10CanteenTest extends TestCase
{
    use RefreshDatabase;

    protected Company $companyA;
    protected Company $companyB;
    protected User $employeeUser;
    protected User $merchantUser;
    protected User $adminUser;
    protected Employee $employeeA;
    protected Employee $employeeB;
    protected CanteenVendor $vendorA;
    protected CanteenVendor $vendorB;

    protected function setUp(): void
    {
        parent::setUp();

        $this->companyA = Company::create([
            'name' => 'PT Crave Holding Group',
            'slug' => 'crave-holding',
            'is_holding' => true,
            'is_active' => true,
        ]);

        $this->companyB = Company::create([
            'name' => 'PT Crave Anak Perusahaan',
            'slug' => 'crave-subsidiary',
            'is_holding' => false,
            'is_active' => true,
        ]);

        $this->employeeUser = User::factory()->create([
            'email' => 'employee@crave.id',
            'name' => 'Budi Santoso',
        ]);
        $this->employeeUser->companies()->attach($this->companyA->id, ['role' => 'employee', 'is_primary' => true]);

        $this->merchantUser = User::factory()->create([
            'email' => 'kasir@kantin.id',
            'name' => 'Kasir Bu Siti',
        ]);
        $this->merchantUser->companies()->attach($this->companyA->id, ['role' => 'supervisor', 'is_primary' => true]);

        $this->adminUser = User::factory()->create([
            'email' => 'admin@crave.id',
            'name' => 'Admin HR',
        ]);
        $this->adminUser->companies()->attach($this->companyA->id, ['role' => 'company_admin', 'is_primary' => true]);

        $dept = Department::create([
            'company_id' => $this->companyA->id,
            'name' => 'Technology',
        ]);

        $desig = Designation::create([
            'company_id' => $this->companyA->id,
            'title' => 'Software Engineer',
        ]);

        $this->employeeA = Employee::create([
            'company_id' => $this->companyA->id,
            'user_id' => $this->employeeUser->id,
            'department_id' => $dept->id,
            'designation_id' => $desig->id,
            'nik' => 'CRV-001',
            'nama_lengkap' => 'Budi Santoso',
            'email' => 'employee@crave.id',
            'nomor_telepon' => '08123456789',
            'status_kerja' => 'tetap',
            'tanggal_masuk' => '2025-01-01',
            'gaji_pokok' => 10000000,
            'is_active' => true,
        ]);

        $this->employeeB = Employee::create([
            'company_id' => $this->companyB->id,
            'user_id' => null,
            'department_id' => null,
            'designation_id' => null,
            'nik' => 'CRV-B-001',
            'nama_lengkap' => 'Karyawan Tenant B',
            'email' => 'tenantb@crave.id',
            'nomor_telepon' => '08129999999',
            'status_kerja' => 'tetap',
            'tanggal_masuk' => '2025-01-01',
            'gaji_pokok' => 8000000,
            'is_active' => true,
        ]);

        $this->vendorA = CanteenVendor::create([
            'company_id' => $this->companyA->id,
            'code' => 'VND-01',
            'name' => 'Katering Bu Siti',
            'pic_name' => 'Siti Rahayu',
            'pic_phone' => '08128881234',
            'location' => 'Lantai 1 Kantin Barat',
            'price_per_meal' => 25000.00,
            'status' => 'active',
        ]);

        $this->vendorB = CanteenVendor::create([
            'company_id' => $this->companyB->id,
            'code' => 'VND-B1',
            'name' => 'Katering Luar Tenant B',
            'pic_name' => 'Pak Joko',
            'pic_phone' => '08137771234',
            'location' => 'Lantai 2',
            'price_per_meal' => 30000.00,
            'status' => 'active',
        ]);
    }

    /**
     * Test 1: Employee can view voucher card and voucher is automatically provisioned for today.
     */
    public function test_employee_can_view_canteen_and_auto_provision_today_voucher(): void
    {
        $response = $this->actingAs($this->employeeUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get(route('canteen.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Canteen/VoucherCard')
            ->has('todayVoucher')
            ->where('todayVoucher.nominal_value', 25000)
            ->where('todayVoucher.status', 'active')
        );

        $this->assertDatabaseHas('canteen_vouchers', [
            'company_id' => $this->companyA->id,
            'employee_id' => $this->employeeA->id,
            'status' => 'active',
            'meal_date' => Carbon::today()->format('Y-m-d'),
        ]);
    }

    /**
     * Test 2: Dynamic 60s QR Token can be refreshed.
     */
    public function test_employee_can_refresh_dynamic_token(): void
    {
        // First, visit page to auto-provision voucher
        $this->actingAs($this->employeeUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get(route('canteen.index'));

        $voucher = CanteenVoucher::where('employee_id', $this->employeeA->id)->first();
        $oldToken = $voucher->encrypted_token;

        $response = $this->actingAs($this->employeeUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->postJson(route('canteen.refresh-token'));

        $response->assertOk();
        $response->assertJsonStructure([
            'success',
            'encrypted_token',
            'expires_at',
            'ttl_seconds',
        ]);

        $voucher->refresh();
        $this->assertNotEquals($oldToken, $voucher->encrypted_token);
        $this->assertTrue($voucher->expires_at->isFuture());
    }

    /**
     * Test 3: Merchant can scan and successfully redeem a valid active voucher (< 1s fast verification).
     */
    public function test_merchant_can_redeem_valid_voucher_successfully(): void
    {
        $voucher = CanteenVoucher::create([
            'company_id' => $this->companyA->id,
            'employee_id' => $this->employeeA->id,
            'voucher_code' => 'CRV-CRN-20261115-ABCDE',
            'encrypted_token' => 'CRV-QR-TEST-TOKEN-12345',
            'meal_date' => Carbon::today()->format('Y-m-d'),
            'meal_type' => 'lunch',
            'nominal_value' => 25000.00,
            'status' => 'active',
            'expires_at' => now()->addSeconds(60),
        ]);

        $response = $this->actingAs($this->merchantUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->postJson(route('canteen.redeem'), [
                'token' => 'CRV-QR-TEST-TOKEN-12345',
                'vendor_id' => $this->vendorA->id,
            ]);

        $response->assertOk();
        $response->assertJson([
            'success' => true,
            'voucher' => [
                'voucher_code' => 'CRV-CRN-20261115-ABCDE',
                'vendor_name' => 'Katering Bu Siti',
            ],
        ]);

        $voucher->refresh();
        $this->assertEquals('redeemed', $voucher->status);
        $this->assertEquals($this->vendorA->id, $voucher->vendor_id);
        $this->assertNotNull($voucher->redeemed_at);
        $this->assertEquals($this->merchantUser->id, $voucher->redeemed_by);
    }

    /**
     * Test 4: Anti-fraud: A voucher cannot be redeemed twice (one-time use).
     */
    public function test_cannot_redeem_already_redeemed_voucher(): void
    {
        $voucher = CanteenVoucher::create([
            'company_id' => $this->companyA->id,
            'employee_id' => $this->employeeA->id,
            'vendor_id' => $this->vendorA->id,
            'voucher_code' => 'CRV-CRN-20261115-ALREADY',
            'encrypted_token' => 'CRV-QR-ALREADY-REDEEMED',
            'meal_date' => Carbon::today()->format('Y-m-d'),
            'nominal_value' => 25000.00,
            'status' => 'redeemed',
            'expires_at' => now()->addMinutes(10),
            'redeemed_at' => now()->subMinutes(5),
            'redeemed_by' => $this->merchantUser->id,
        ]);

        $response = $this->actingAs($this->merchantUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->postJson(route('canteen.redeem'), [
                'token' => 'CRV-QR-ALREADY-REDEEMED',
                'vendor_id' => $this->vendorA->id,
            ]);

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
            'already_redeemed' => true,
        ]);
    }

    /**
     * Test 5: Anti-screenshot: An expired token (> 60s TTL) is rejected.
     */
    public function test_cannot_redeem_expired_token(): void
    {
        $voucher = CanteenVoucher::create([
            'company_id' => $this->companyA->id,
            'employee_id' => $this->employeeA->id,
            'voucher_code' => 'CRV-CRN-20261115-EXPIRED',
            'encrypted_token' => 'CRV-QR-EXPIRED-TOKEN-999',
            'meal_date' => Carbon::today()->format('Y-m-d'),
            'nominal_value' => 25000.00,
            'status' => 'active',
            'expires_at' => now()->subSeconds(5), // Expired 5 seconds ago!
        ]);

        $response = $this->actingAs($this->merchantUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->postJson(route('canteen.redeem'), [
                'token' => 'CRV-QR-EXPIRED-TOKEN-999',
                'vendor_id' => $this->vendorA->id,
            ]);

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
            'expired' => true,
        ]);

        $voucher->refresh();
        $this->assertEquals('active', $voucher->status); // Remains active, unredeemed
    }

    /**
     * Test 6: Zero Cross-Tenant Data Leakage: Merchant in Company A cannot redeem voucher or use vendor from Company B.
     */
    public function test_zero_cross_tenant_data_leakage(): void
    {
        // Voucher created for Company B
        $voucherB = CanteenVoucher::create([
            'company_id' => $this->companyB->id,
            'employee_id' => $this->employeeB->id,
            'voucher_code' => 'CRV-B-VOUCHER-001',
            'encrypted_token' => 'TOKEN-COMPANY-B-SECRET',
            'meal_date' => Carbon::today()->format('Y-m-d'),
            'nominal_value' => 30000.00,
            'status' => 'active',
            'expires_at' => now()->addSeconds(60),
        ]);

        // Merchant in Company A attempts to redeem token belonging to Company B
        $response = $this->actingAs($this->merchantUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->postJson(route('canteen.redeem'), [
                'token' => 'TOKEN-COMPANY-B-SECRET',
                'vendor_id' => $this->vendorA->id,
            ]);

        $response->assertNotFound();

        // Merchant in Company A attempts to use vendor belonging to Company B
        $voucherA = CanteenVoucher::create([
            'company_id' => $this->companyA->id,
            'employee_id' => $this->employeeA->id,
            'voucher_code' => 'CRV-A-VOUCHER-001',
            'encrypted_token' => 'TOKEN-COMPANY-A-VALID',
            'meal_date' => Carbon::today()->format('Y-m-d'),
            'nominal_value' => 25000.00,
            'status' => 'active',
            'expires_at' => now()->addSeconds(60),
        ]);

        $responseVendorB = $this->actingAs($this->merchantUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->postJson(route('canteen.redeem'), [
                'token' => 'TOKEN-COMPANY-A-VALID',
                'vendor_id' => $this->vendorB->id, // Vendor B belongs to Company B
            ]);

        $responseVendorB->assertNotFound();
    }

    /**
     * Test 7: Admin can view vendor settlement and create new vendor.
     */
    public function test_admin_can_view_settlement_and_create_vendor(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->get(route('canteen.settlement'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Canteen/Reports')
            ->has('kpis')
            ->has('vendors')
            ->has('dailyTrend')
            ->has('vendorComposition')
        );

        $storeResponse = $this->actingAs($this->adminUser)
            ->withSession(['active_company_id' => $this->companyA->id])
            ->post(route('canteen.vendors.store'), [
                'code' => 'VND-04',
                'name' => 'Waroeng Padang Murah',
                'pic_name' => 'Uni Desi',
                'pic_phone' => '081234567890',
                'location' => 'Lantai 1 Kantin Timur',
                'price_per_meal' => 25000,
            ]);

        $storeResponse->assertRedirect();
        $this->assertDatabaseHas('canteen_vendors', [
            'company_id' => $this->companyA->id,
            'code' => 'VND-04',
            'name' => 'Waroeng Padang Murah',
        ]);
    }
}
