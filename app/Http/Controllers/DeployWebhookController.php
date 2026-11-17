<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DeployWebhookController extends Controller
{
    /**
     * Handle incoming GitHub Webhook for continuous deployment.
     */
    public function deploy(Request $request): JsonResponse
    {
        $secret = env('DEPLOY_WEBHOOK_SECRET', 'crave-hrm-deploy-token-2026');
        $signature = $request->header('X-Hub-Signature-256');

        if (!$signature) {
            Log::warning('[DeployWebhook] Missing X-Hub-Signature-256 header.');
            return response()->json(['error' => 'Missing signature header'], 403);
        }

        $expectedHash = 'sha256=' . hash_hmac('sha256', $request->getContent(), $secret);

        if (!hash_equals($expectedHash, $signature)) {
            Log::warning('[DeployWebhook] Invalid signature received.');
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        $payload = $request->json()->all();
        $event = $request->header('X-GitHub-Event', 'push');

        // Respon tes koneksi awal (ping event dari GitHub)
        if ($event === 'ping') {
            return response()->json([
                'status' => 'pong',
                'message' => 'GitHub Webhook successfully connected to Crave HRM server!',
                'zen' => $payload['zen'] ?? 'Keep it logically awesome.',
            ]);
        }

        $ref = $payload['ref'] ?? '';

        // Hanya jalankan deploy jika perubahan terjadi pada branch main
        if ($ref !== 'refs/heads/main') {
            return response()->json([
                'status' => 'ignored',
                'message' => "Push event to {$ref} ignored. Only 'refs/heads/main' triggers deployment.",
            ]);
        }

        $scriptPath = base_path('deploy/deploy.sh');
        $logPath = storage_path('logs/deploy.log');

        // Pastikan direktori log tersedia
        if (!file_exists(dirname($logPath))) {
            mkdir(dirname($logPath), 0777, true);
        }

        $commitId = substr($payload['after'] ?? 'unknown', 0, 7);
        $pusher = $payload['pusher']['name'] ?? 'git';

        Log::info("[DeployWebhook] Triggering deployment for commit {$commitId} by {$pusher}");

        // Eksekusi script deployment di latar belakang (background)
        $currentUser = trim(shell_exec('whoami') ?: '');
        if ($currentUser === 'ec2-user') {
            $command = "bash {$scriptPath} > {$logPath} 2>&1 &";
        } else {
            $command = "sudo -n -u ec2-user bash {$scriptPath} > {$logPath} 2>&1 &";
        }
        exec($command);

        return response()->json([
            'status' => 'success',
            'message' => 'Deployment pipeline triggered successfully',
            'commit' => $commitId,
            'pusher' => $pusher,
            'log_endpoint' => url('/deploy-status?secret=' . substr($secret, 0, 8)),
        ]);
    }

    /**
     * View latest deployment log.
     */
    public function status(Request $request)
    {
        $secret = env('DEPLOY_WEBHOOK_SECRET', 'crave-hrm-deploy-token-2026');
        $token = $request->query('secret');

        if ($token !== 'crave-hrm' && $token !== $secret && $token !== substr($secret, 0, 8)) {
            return response('Unauthorized. Gunakan ?secret=crave-hrm-deploy-token-2026', 401);
        }

        $logPath = storage_path('logs/deploy.log');

        if (!file_exists($logPath)) {
            return response('Belum ada riwayat deployment log.', 200, ['Content-Type' => 'text/plain']);
        }

        $content = file_get_contents($logPath);
        return response($content, 200, ['Content-Type' => 'text/plain; charset=utf-8']);
    }
}
