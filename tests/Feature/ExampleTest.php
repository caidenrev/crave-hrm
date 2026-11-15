<?php

namespace Tests\Feature;

use App\Models\Company;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        Company::create([
            'name' => 'PT Crave Solusi Nusantara',
            'code' => 'CSN',
            'slug' => 'csn',
            'email' => 'admin@csn.com',
            'timezone' => 'Asia/Jakarta',
            'currency' => 'IDR',
        ]);

        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
