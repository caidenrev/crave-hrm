<?php

namespace Tests\Feature;

use Tests\TestCase;

class DeployWebhookTest extends TestCase
{
    public function test_webhook_rejects_missing_signature(): void
    {
        $response = $this->postJson('/deploy-webhook', ['ref' => 'refs/heads/main']);
        $response->assertStatus(403);
    }

    public function test_webhook_rejects_invalid_signature(): void
    {
        $response = $this->withHeaders([
            'X-Hub-Signature-256' => 'sha256=invalidhash1234567890',
        ])->postJson('/deploy-webhook', ['ref' => 'refs/heads/main']);

        $response->assertStatus(403);
    }

    public function test_webhook_ignores_non_main_branch(): void
    {
        $secret = env('DEPLOY_WEBHOOK_SECRET', 'crave-hrm-deploy-token-2026');
        $payload = json_encode(['ref' => 'refs/heads/feature-test']);
        $signature = 'sha256=' . hash_hmac('sha256', $payload, $secret);

        $response = $this->call(
            'POST',
            '/deploy-webhook',
            [],
            [],
            [],
            [
                'HTTP_X-Hub-Signature-256' => $signature,
                'CONTENT_TYPE' => 'application/json',
            ],
            $payload
        );

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'ignored',
        ]);
    }
}
