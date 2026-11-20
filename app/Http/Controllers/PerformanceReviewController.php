<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Employee;
use App\Models\PerformanceReview;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PerformanceReviewController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user && \Illuminate\Support\Facades\Schema::hasTable('users')) {
            $user = \App\Models\User::first();
        }

        $activeCompany = $user?->currentCompany();
        if (!$activeCompany) {
            $activeCompany = Company::where('is_holding', true)->first() ?? Company::first();
        }
        $companyId = $activeCompany?->id;

        $currentEmployee = $user?->employees()->where('company_id', $companyId)->first();
        if (!$currentEmployee) {
            $currentEmployee = Employee::where('company_id', $companyId)->first();
        }

        $cycleName = 'Q4 2026';

        // Auto-seed initial demo review dataset if empty for current company
        if (PerformanceReview::where('company_id', $companyId)->count() === 0 && $currentEmployee) {
            $colleagues = Employee::where('company_id', $companyId)
                ->where('id', '!=', $currentEmployee->id)
                ->take(3)
                ->get();

            // 1. Self Review
            PerformanceReview::create([
                'company_id' => $companyId,
                'employee_id' => $currentEmployee->id,
                'reviewer_id' => $currentEmployee->id,
                'reviewer_type' => 'self',
                'cycle_name' => $cycleName,
                'status' => 'completed',
                'score_technical' => 4.5,
                'score_communication' => 4.2,
                'score_initiative' => 4.8,
                'score_problem_solving' => 4.4,
                'score_integrity' => 5.0,
                'overall_score' => 4.58,
                'strengths' => 'Mampu menyelesaikan arsitektur sistem monolit modern dan implementasi PPh 21 TER tepat waktu.',
                'improvements' => 'Perlu mendelegasikan beberapa tugas teknis operasional agar lebih fokus ke strategi jangka panjang.',
                'completed_at' => Carbon::now()->subDays(2),
            ]);

            // 2. Supervisor Review
            $supervisor = $colleagues->first();
            if ($supervisor) {
                PerformanceReview::create([
                    'company_id' => $companyId,
                    'employee_id' => $currentEmployee->id,
                    'reviewer_id' => $supervisor->id,
                    'reviewer_type' => 'supervisor',
                    'cycle_name' => $cycleName,
                    'status' => 'completed',
                    'score_technical' => 4.8,
                    'score_communication' => 4.0,
                    'score_initiative' => 4.7,
                    'score_problem_solving' => 4.6,
                    'score_integrity' => 5.0,
                    'overall_score' => 4.62,
                    'strengths' => 'Kepemimpinan teknis sangat solid dan kepatuhan regulasi ketenagakerjaan terimplementasi akurat.',
                    'improvements' => 'Tingkatkan dokumentasi SOP tertulis untuk tim junior.',
                    'completed_at' => Carbon::now()->subDay(),
                ]);
            }

            // 3. Peer Reviews
            $peer = $colleagues->skip(1)->first();
            if ($peer) {
                PerformanceReview::create([
                    'company_id' => $companyId,
                    'employee_id' => $currentEmployee->id,
                    'reviewer_id' => $peer->id,
                    'reviewer_type' => 'peer',
                    'cycle_name' => $cycleName,
                    'status' => 'completed',
                    'score_technical' => 4.6,
                    'score_communication' => 4.5,
                    'score_initiative' => 4.5,
                    'score_problem_solving' => 4.3,
                    'score_integrity' => 4.9,
                    'overall_score' => 4.56,
                    'strengths' => 'Sangat responsif dan selalu memberikan feedback konstruktif saat code review.',
                    'improvements' => 'Sering kali memprioritaskan jadwal sprint ketat.',
                    'completed_at' => Carbon::now()->subHours(5),
                ]);

                // Also create 1 pending review assigned to currentEmployee to evaluate the peer
                PerformanceReview::create([
                    'company_id' => $companyId,
                    'employee_id' => $peer->id,
                    'reviewer_id' => $currentEmployee->id,
                    'reviewer_type' => 'peer',
                    'cycle_name' => $cycleName,
                    'status' => 'pending',
                ]);
            }
        }

        // Fetch Reviews
        $allReviews = PerformanceReview::where('company_id', $companyId)
            ->with(['employee.department', 'reviewer.department'])
            ->latest('id')
            ->get();

        $reviewsAboutMe = $currentEmployee
            ? $allReviews->where('employee_id', $currentEmployee->id)->values()
            : collect();

        $reviewsToFill = $currentEmployee
            ? $allReviews->where('reviewer_id', $currentEmployee->id)->where('status', 'pending')->values()
            : collect();

        // Calculate Radar Comparison Data for currentEmployee
        $selfReview = $reviewsAboutMe->firstWhere('reviewer_type', 'self');
        $supReview = $reviewsAboutMe->firstWhere('reviewer_type', 'supervisor');
        $peerReviews = $reviewsAboutMe->where('reviewer_type', 'peer');

        $avgPeerTech = $peerReviews->avg('score_technical') ?: 4.2;
        $avgPeerComm = $peerReviews->avg('score_communication') ?: 4.4;
        $avgPeerInit = $peerReviews->avg('score_initiative') ?: 4.3;
        $avgPeerProb = $peerReviews->avg('score_problem_solving') ?: 4.2;
        $avgPeerInteg = $peerReviews->avg('score_integrity') ?: 4.8;

        $radarData = [
            [
                'subject' => 'Teknis & Kualitas',
                'Self' => $selfReview ? $selfReview->score_technical : 4.5,
                'Supervisor' => $supReview ? $supReview->score_technical : 4.8,
                'Peer' => round($avgPeerTech, 1),
                'Target' => 4.0,
                'fullMark' => 5.0,
            ],
            [
                'subject' => 'Komunikasi & Tim',
                'Self' => $selfReview ? $selfReview->score_communication : 4.2,
                'Supervisor' => $supReview ? $supReview->score_communication : 4.0,
                'Peer' => round($avgPeerComm, 1),
                'Target' => 4.0,
                'fullMark' => 5.0,
            ],
            [
                'subject' => 'Inisiatif & Delivery',
                'Self' => $selfReview ? $selfReview->score_initiative : 4.8,
                'Supervisor' => $supReview ? $supReview->score_initiative : 4.7,
                'Peer' => round($avgPeerInit, 1),
                'Target' => 4.0,
                'fullMark' => 5.0,
            ],
            [
                'subject' => 'Pemecahan Masalah',
                'Self' => $selfReview ? $selfReview->score_problem_solving : 4.4,
                'Supervisor' => $supReview ? $supReview->score_problem_solving : 4.6,
                'Peer' => round($avgPeerProb, 1),
                'Target' => 4.0,
                'fullMark' => 5.0,
            ],
            [
                'subject' => 'Integritas & Budaya',
                'Self' => $selfReview ? $selfReview->score_integrity : 5.0,
                'Supervisor' => $supReview ? $supReview->score_integrity : 5.0,
                'Peer' => round($avgPeerInteg, 1),
                'Target' => 4.0,
                'fullMark' => 5.0,
            ],
        ];

        // Overall stats
        $completedReviewsCount = $allReviews->where('status', 'completed')->count();
        $totalReviewsCount = $allReviews->count();
        $avgScore = $completedReviewsCount > 0 ? round($allReviews->where('status', 'completed')->avg('overall_score'), 2) : 4.59;

        $metrics = [
            'total_reviews' => $totalReviewsCount,
            'completed_reviews' => $completedReviewsCount,
            'completion_rate' => $totalReviewsCount > 0 ? round(($completedReviewsCount / $totalReviewsCount) * 100) : 100,
            'avg_score' => $avgScore,
            'pending_reviews_for_me' => $reviewsToFill->count(),
            'cycle_name' => $cycleName,
        ];

        return Inertia::render('Performance/Index', [
            'metrics' => $metrics,
            'radarData' => $radarData,
            'reviewsAboutMe' => $reviewsAboutMe,
            'reviewsToFill' => $reviewsToFill,
            'allReviews' => $allReviews,
            'currentEmployee' => $currentEmployee,
            'employees' => Employee::where('company_id', $companyId)->where('is_active', true)->get(['id', 'nama_lengkap', 'nik', 'email']),
        ]);
    }

    public function storeEvaluation(Request $request)
    {
        $validated = $request->validate([
            'review_id' => 'nullable|exists:performance_reviews,id',
            'employee_id' => 'required|exists:employees,id',
            'reviewer_type' => 'required|string|in:self,supervisor,peer,subordinate',
            'score_technical' => 'required|numeric|min:1|max:5',
            'score_communication' => 'required|numeric|min:1|max:5',
            'score_initiative' => 'required|numeric|min:1|max:5',
            'score_problem_solving' => 'required|numeric|min:1|max:5',
            'score_integrity' => 'required|numeric|min:1|max:5',
            'strengths' => 'nullable|string|max:1000',
            'improvements' => 'nullable|string|max:1000',
        ]);

        $overall = round((
            $validated['score_technical'] +
            $validated['score_communication'] +
            $validated['score_initiative'] +
            $validated['score_problem_solving'] +
            $validated['score_integrity']
        ) / 5, 2);

        $user = $request->user();
        $activeCompany = $user?->currentCompany();
        $currentEmployee = $user?->employees()->where('company_id', $activeCompany?->id)->first();

        if (!empty($validated['review_id'])) {
            $review = PerformanceReview::findOrFail($validated['review_id']);
            $review->update([
                'score_technical' => $validated['score_technical'],
                'score_communication' => $validated['score_communication'],
                'score_initiative' => $validated['score_initiative'],
                'score_problem_solving' => $validated['score_problem_solving'],
                'score_integrity' => $validated['score_integrity'],
                'overall_score' => $overall,
                'strengths' => $validated['strengths'] ?? null,
                'improvements' => $validated['improvements'] ?? null,
                'status' => 'completed',
                'completed_at' => Carbon::now(),
            ]);
        } else {
            PerformanceReview::create([
                'company_id' => $activeCompany?->id,
                'employee_id' => $validated['employee_id'],
                'reviewer_id' => $currentEmployee?->id,
                'reviewer_type' => $validated['reviewer_type'],
                'cycle_name' => 'Q4 2026',
                'score_technical' => $validated['score_technical'],
                'score_communication' => $validated['score_communication'],
                'score_initiative' => $validated['score_initiative'],
                'score_problem_solving' => $validated['score_problem_solving'],
                'score_integrity' => $validated['score_integrity'],
                'overall_score' => $overall,
                'strengths' => $validated['strengths'] ?? null,
                'improvements' => $validated['improvements'] ?? null,
                'status' => 'completed',
                'completed_at' => Carbon::now(),
            ]);
        }

        return redirect()->back()->with('success', 'Evaluasi 360 Performance berhasil disimpan.');
    }
}
