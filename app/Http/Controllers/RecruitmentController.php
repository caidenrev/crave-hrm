<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Candidate;
use App\Models\Company;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\JobPosting;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class RecruitmentController extends Controller
{
    /**
     * Admin ATS Kanban Board & Job Vacancies Dashboard.
     */
    public function index(Request $request)
    {
        $companyId = session('active_company_id');

        $selectedJobId = $request->query('job_id');
        $search = $request->query('search');
        $archiveFilter = $request->query('archive', 'active'); // 'active' (20-day window) | 'all'

        // All job postings for this company
        $jobPostings = JobPosting::where('company_id', $companyId)
            ->with(['department', 'branch'])
            ->withCount('candidates')
            ->latest()
            ->get();

        // Candidates Query
        $candidatesQuery = Candidate::where('company_id', $companyId)
            ->with(['jobPosting.department', 'jobPosting.branch', 'employee']);

        if ($selectedJobId && $selectedJobId !== 'all') {
            $candidatesQuery->where('job_posting_id', $selectedJobId);
        }

        if ($search) {
            $candidatesQuery->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('current_title', 'like', "%{$search}%");
            });
        }

        // Auto-archive 20 days rule: In active view, hide hired & rejected older than 20 days
        $twentyDaysAgo = Carbon::now()->subDays(20);
        if ($archiveFilter === 'active') {
            $candidatesQuery->where(function ($q) use ($twentyDaysAgo) {
                $q->whereIn('stage', ['applied', 'screening', 'interview', 'offering'])
                    ->orWhere(function ($sub) use ($twentyDaysAgo) {
                        $sub->where('stage', 'hired')
                            ->where(function ($h) use ($twentyDaysAgo) {
                                $h->where('hired_at', '>=', $twentyDaysAgo)
                                    ->orWhere(function ($w) use ($twentyDaysAgo) {
                                        $w->whereNull('hired_at')->where('updated_at', '>=', $twentyDaysAgo);
                                    });
                            });
                    })
                    ->orWhere(function ($sub) use ($twentyDaysAgo) {
                        $sub->where('stage', 'rejected')
                            ->where('updated_at', '>=', $twentyDaysAgo);
                    });
            });
        }

        $candidates = $candidatesQuery->latest()->get();

        // Calculate count of archived candidates (> 20 days)
        $archivedCount = Candidate::where('company_id', $companyId)
            ->where(function ($q) use ($twentyDaysAgo) {
                $q->where(function ($sub) use ($twentyDaysAgo) {
                    $sub->where('stage', 'hired')
                        ->where(function ($h) use ($twentyDaysAgo) {
                            $h->where('hired_at', '<', $twentyDaysAgo)
                                ->orWhere(function ($w) use ($twentyDaysAgo) {
                                    $w->whereNull('hired_at')->where('updated_at', '<', $twentyDaysAgo);
                                });
                        });
                })->orWhere(function ($sub) use ($twentyDaysAgo) {
                    $sub->where('stage', 'rejected')
                        ->where('updated_at', '<', $twentyDaysAgo);
                });
            })->count();

        // Metrics for Top KPI Cards
        $totalCandidates = Candidate::where('company_id', $companyId)->count();
        $screeningCount = Candidate::where('company_id', $companyId)->where('stage', 'screening')->count();
        $interviewCount = Candidate::where('company_id', $companyId)->where('stage', 'interview')->count();
        $offeringCount = Candidate::where('company_id', $companyId)->where('stage', 'offering')->count();
        $hiredCount = Candidate::where('company_id', $companyId)->where('stage', 'hired')->count();
        $openJobsCount = $jobPostings->where('status', 'published')->count();

        // Departments & Branches for Job Creation modal
        $departments = Department::where('company_id', $companyId)->get();
        $branches = Branch::where('company_id', $companyId)->get();
        $designations = Designation::where('company_id', $companyId)->get();

        $activeCompany = Company::find($companyId);

        return Inertia::render('Recruitment/KanbanBoard', [
            'candidates' => $candidates,
            'jobPostings' => $jobPostings,
            'selectedJobId' => $selectedJobId ?? 'all',
            'search' => $search ?? '',
            'archiveFilter' => $archiveFilter,
            'archivedCount' => $archivedCount,
            'metrics' => [
                'total_candidates' => $totalCandidates,
                'screening_count' => $screeningCount,
                'interview_count' => $interviewCount,
                'offering_count' => $offeringCount,
                'hired_count' => $hiredCount,
                'open_jobs_count' => $openJobsCount,
            ],
            'departments' => $departments,
            'branches' => $branches,
            'designations' => $designations,
            'companySlug' => $activeCompany?->slug ?? 'crave-holding',
        ]);
    }

    /**
     * Store a new Job Vacancy.
     */
    public function storeJob(Request $request)
    {
        $companyId = session('active_company_id');

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'branch_id' => 'nullable|exists:branches,id',
            'department_id' => 'nullable|exists:departments,id',
            'designation_id' => 'nullable|exists:designations,id',
            'employment_type' => 'required|string|in:PKWTT,PKWT,Internship,Freelance',
            'workplace_type' => 'required|string|in:On-site,Hybrid,Remote',
            'experience_level' => 'required|string|in:Entry Level,Mid Level,Senior Level,Lead / Manager',
            'min_salary' => 'nullable|numeric|min:0',
            'max_salary' => 'nullable|numeric|min:0',
            'show_salary' => 'boolean',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'benefits' => 'nullable|string',
            'vacancies_count' => 'required|integer|min:1',
            'deadline' => 'nullable|date',
            'status' => 'required|string|in:draft,published,closed',
        ]);

        $validated['company_id'] = $companyId;
        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::lower(Str::random(6));

        JobPosting::create($validated);

        return redirect()->back()->with('success', 'Lowongan pekerjaan baru berhasil diterbitkan.');
    }

    /**
     * Update an existing Job Vacancy.
     */
    public function updateJob(Request $request, JobPosting $job)
    {
        $companyId = session('active_company_id');
        if ($job->company_id !== $companyId) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'branch_id' => 'nullable|exists:branches,id',
            'department_id' => 'nullable|exists:departments,id',
            'designation_id' => 'nullable|exists:designations,id',
            'employment_type' => 'required|string|in:PKWTT,PKWT,Internship,Freelance',
            'workplace_type' => 'required|string|in:On-site,Hybrid,Remote',
            'experience_level' => 'required|string|in:Entry Level,Mid Level,Senior Level,Lead / Manager',
            'min_salary' => 'nullable|numeric|min:0',
            'max_salary' => 'nullable|numeric|min:0',
            'show_salary' => 'boolean',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'benefits' => 'nullable|string',
            'vacancies_count' => 'required|integer|min:1',
            'deadline' => 'nullable|date',
            'status' => 'required|string|in:draft,published,closed',
        ]);

        $job->update($validated);

        return redirect()->back()->with('success', 'Lowongan pekerjaan berhasil diperbarui.');
    }

    /**
     * Delete a Job Vacancy.
     */
    public function destroyJob(JobPosting $job)
    {
        $companyId = session('active_company_id');
        if ($job->company_id !== $companyId) {
            abort(403);
        }

        $job->delete();

        return redirect()->back()->with('success', 'Lowongan pekerjaan berhasil dihapus.');
    }

    /**
     * Update Candidate Stage in Kanban Pipeline.
     */
    public function updateStage(Request $request, Candidate $candidate)
    {
        $companyId = session('active_company_id');
        if ($candidate->company_id !== $companyId) {
            abort(403);
        }

        // Strict lock: candidate already converted to employee cannot be reverted or changed
        if ($candidate->is_converted_to_employee || $candidate->employee_id) {
            return redirect()->back()->withErrors([
                'error' => "Kandidat {$candidate->full_name} telah resmi menjadi Karyawan (Onboarded). Status tahap rekrutmen telah dikunci permanen dan tidak dapat diubah kembali.",
            ]);
        }

        $validated = $request->validate([
            'stage' => 'required|string|in:applied,screening,interview,offering,hired,rejected',
            'rejection_reason' => 'nullable|string',
        ]);

        $updateData = ['stage' => $validated['stage']];

        if ($validated['stage'] === 'hired' && !$candidate->hired_at) {
            $updateData['hired_at'] = now();
        }

        if ($validated['stage'] === 'rejected' && isset($validated['rejection_reason'])) {
            $updateData['rejection_reason'] = $validated['rejection_reason'];
        }

        $candidate->update($updateData);

        return redirect()->back()->with('success', "Tahap pelamar {$candidate->full_name} berhasil diubah ke {$validated['stage']}.");
    }

    /**
     * Update Candidate Scorecard, Rating & Notes.
     */
    public function updateScorecard(Request $request, Candidate $candidate)
    {
        $companyId = session('active_company_id');
        if ($candidate->company_id !== $companyId) {
            abort(403);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:0|max:5',
            'interview_notes' => 'nullable|string',
            'offered_salary' => 'nullable|numeric|min:0',
        ]);

        // Scorecard rating validation: only allowed starting from screening onwards
        if ($candidate->stage === 'applied' && (int)$validated['rating'] > 0) {
            return redirect()->back()->withErrors([
                'error' => 'Penilaian rating kandidat hanya dapat diberikan setelah memasuki tahap Screening atau Wawancara.',
            ]);
        }

        $candidate->update($validated);

        return redirect()->back()->with('success', 'Catatan penilaian dan rating pelamar berhasil disimpan.');
    }

    /**
     * Schedule Interview session with Date & Meeting Link.
     */
    public function scheduleInterview(Request $request, Candidate $candidate)
    {
        $companyId = session('active_company_id');
        if ($candidate->company_id !== $companyId) {
            abort(403);
        }

        $validated = $request->validate([
            'interview_scheduled_at' => 'required|date',
            'interview_meeting_link' => 'nullable|string|max:255',
            'interview_notes' => 'nullable|string',
        ]);

        // If candidate is in applied or screening, automatically advance to interview stage
        if (in_array($candidate->stage, ['applied', 'screening'])) {
            $validated['stage'] = 'interview';
        }

        $candidate->update($validated);

        return redirect()->back()->with('success', "Sesi wawancara untuk {$candidate->full_name} berhasil dijadwalkan.");
    }

    /**
     * 1-Click Onboard to Employee.
     * Converts a Hired candidate into the official master employees table.
     */
    public function convertToEmployee(Request $request, Candidate $candidate)
    {
        $companyId = session('active_company_id');
        if ($candidate->company_id !== $companyId) {
            abort(403);
        }

        // Strict Stage Enforcement: Must be in 'hired' stage
        if ($candidate->stage !== 'hired') {
            return redirect()->back()->withErrors([
                'error' => "Kandidat {$candidate->full_name} saat ini berada di tahap '{$candidate->stage}'. Onboarding ke Master Data Karyawan hanya diperbolehkan jika kandidat telah mencapai tahap Diterima (Hired).",
            ]);
        }

        // Check if already converted
        if ($candidate->is_converted_to_employee || $candidate->employee_id) {
            return redirect()->back()->withErrors([
                'error' => "Kandidat {$candidate->full_name} sudah dikonversi menjadi Karyawan resmi sebelumnya.",
            ]);
        }

        try {
            DB::transaction(function () use ($candidate, $companyId) {
                // Generate Next NIK
                $latestEmployee = Employee::where('company_id', $companyId)->latest('id')->first();
                $nextNumber = $latestEmployee ? ($latestEmployee->id + 1) : 1;
                $prefix = 'EMP-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

                // Determine salary
                $salary = $candidate->offered_salary
                    ?? $candidate->jobPosting?->min_salary
                    ?? 10000000;

                // Create official Employee record
                $employee = Employee::create([
                    'company_id' => $companyId,
                    'branch_id' => $candidate->jobPosting?->branch_id,
                    'department_id' => $candidate->jobPosting?->department_id,
                    'designation_id' => $candidate->jobPosting?->designation_id,
                    'nik' => $prefix,
                    'nama_lengkap' => $candidate->full_name,
                    'email' => $candidate->email,
                    'nomor_telepon' => $candidate->phone,
                    'tanggal_masuk' => now()->format('Y-m-d'),
                    'status_kerja' => $candidate->jobPosting?->employment_type ?? 'PKWTT',
                    'ptkp_status' => 'TK/0',
                    'gaji_pokok' => $salary,
                    'is_active' => true,
                ]);

                // Update candidate status
                $candidate->update([
                    'stage' => 'hired',
                    'is_converted_to_employee' => true,
                    'employee_id' => $employee->id,
                    'hired_at' => $candidate->hired_at ?? now(),
                ]);
            });

            return redirect()->back()->with('success', "Kandidat {$candidate->full_name} berhasil di-onboard menjadi Karyawan baru!");
        } catch (\Throwable $e) {
            Log::error('Candidate onboarding failed: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => 'Gagal mengonversi kandidat menjadi karyawan: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Formal Offering Letter printable view.
     */
    public function offeringLetter(Candidate $candidate)
    {
        $companyId = session('active_company_id');
        if ($candidate->company_id !== $companyId) {
            abort(403);
        }

        $candidate->load(['jobPosting.department', 'jobPosting.branch', 'company']);

        return view('recruitment.offering-letter', [
            'candidate' => $candidate,
            'job' => $candidate->jobPosting,
            'company' => $candidate->company,
            'letterDate' => now()->translatedFormat('d F Y'),
            'refNumber' => 'OL/CRV/' . now()->format('Ym') . '/' . str_pad($candidate->id, 4, '0', STR_PAD_LEFT),
        ]);
    }

    /**
     * Delete a Candidate record from ATS Kanban.
     */
    public function destroyCandidate(Candidate $candidate)
    {
        $companyId = session('active_company_id');
        if ($candidate->company_id !== $companyId) {
            abort(403);
        }

        // Prevent deleting a candidate if they are currently an active converted employee
        if ($candidate->is_converted_to_employee && $candidate->employee_id) {
            return redirect()->back()->withErrors([
                'error' => "Pelamar {$candidate->full_name} telah resmi menjadi Karyawan aktif. Hapus akun di Master Data Karyawan terlebih dahulu jika ingin menghapus berkas pelamar.",
            ]);
        }

        $candidateName = $candidate->full_name;
        $candidate->delete();

        return redirect()->back()->with('success', "Berkas pelamar {$candidateName} berhasil dihapus dari sistem.");
    }

    /**
     * ==========================================
     * PUBLIC CAREER PORTAL (GUEST SURFACE)
     * ==========================================
     */

    /**
     * Public Career Portal Landing Page.
     */
    public function publicPortal(Request $request, ?string $companySlug = null)
    {
        $company = null;
        if ($companySlug) {
            $company = Company::where('slug', $companySlug)->first();
        }

        if (!$company) {
            $company = Company::where('is_holding', true)->first() ?? Company::first();
        }

        if (!$company) {
            abort(404, 'Perusahaan tidak ditemukan.');
        }

        $search = $request->query('q');
        $departmentId = $request->query('department');
        $workplaceType = $request->query('type');

        $jobsQuery = JobPosting::where('company_id', $company->id)
            ->where('status', 'published')
            ->with(['department', 'branch']);

        if ($search) {
            $jobsQuery->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($departmentId && $departmentId !== 'all') {
            $jobsQuery->where('department_id', $departmentId);
        }

        if ($workplaceType && $workplaceType !== 'all') {
            $jobsQuery->where('workplace_type', $workplaceType);
        }

        $jobs = $jobsQuery->latest()->get();

        $departments = Department::where('company_id', $company->id)->get();
        $branches = Branch::where('company_id', $company->id)->get();

        return Inertia::render('Career/PublicPortal', [
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'slug' => $company->slug,
                'address' => $company->address ?? 'Jakarta, Indonesia',
            ],
            'jobs' => $jobs,
            'departments' => $departments,
            'branches' => $branches,
            'filters' => [
                'q' => $search ?? '',
                'department' => $departmentId ?? 'all',
                'type' => $workplaceType ?? 'all',
            ],
        ]);
    }

    /**
     * Submit Public Job Application.
     */
    public function publicApply(Request $request, string $jobSlug)
    {
        $job = JobPosting::where('slug', $jobSlug)
            ->where('status', 'published')
            ->firstOrFail();

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'current_company' => 'nullable|string|max:255',
            'current_title' => 'nullable|string|max:255',
            'linkedin_url' => 'nullable|url|max:255',
            'portfolio_url' => 'nullable|url|max:255',
            'cover_letter' => 'nullable|string',
            'resume' => 'nullable|file|mimes:pdf,doc,docx|max:4096',
        ]);

        $resumePath = null;
        if ($request->hasFile('resume')) {
            $file = $request->file('resume');
            $filename = Str::slug($validated['full_name']) . '-' . time() . '.' . $file->getClientOriginalExtension();
            $resumePath = $file->storeAs('resumes', $filename, 'public');
        }

        // Prevent spam duplicate apply on same job
        $existing = Candidate::where('job_posting_id', $job->id)
            ->where('email', $validated['email'])
            ->first();

        if ($existing) {
            return redirect()->back()->withErrors([
                'email' => 'Anda sudah mengajukan lamaran untuk posisi ini sebelumnya.',
            ]);
        }

        Candidate::create([
            'company_id' => $job->company_id,
            'job_posting_id' => $job->id,
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'current_company' => $validated['current_company'] ?? null,
            'current_title' => $validated['current_title'] ?? null,
            'linkedin_url' => $validated['linkedin_url'] ?? null,
            'portfolio_url' => $validated['portfolio_url'] ?? null,
            'resume_path' => $resumePath ? '/storage/' . $resumePath : null,
            'cover_letter' => $validated['cover_letter'] ?? null,
            'source' => 'Career Portal',
            'stage' => 'applied',
            'rating' => 0,
        ]);

        return redirect()->back()->with('success', 'Lamaran Anda berhasil dikirim! Tim Talent Acquisition kami akan segera meninjau berkas Anda.');
    }
}

