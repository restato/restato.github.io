import type { JobPosting } from '../../types/jobs';

interface JobCardProps {
  job: JobPosting;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <a
      href={job.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-text-muted)] bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] transition-all duration-200 group"
    >
      <div className="flex items-start gap-3">
        {/* 회사 로고/아이콘 */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ backgroundColor: job.companyColor }}
        >
          {job.company.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          {/* 제목 */}
          <h3 className="font-semibold text-[var(--color-text)] group-hover:text-blue-500 transition-colors line-clamp-2">
            {job.title}
          </h3>

          {/* 회사명 */}
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{job.company}</p>

          {/* 메타 정보 */}
          <div className="flex flex-wrap gap-2 mt-2">
            {job.department && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {job.department}
              </span>
            )}
            {job.location && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                📍 {job.location}
              </span>
            )}
            {job.employmentType && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                {job.employmentType}
              </span>
            )}
          </div>

          {/* 마감일 */}
          {job.deadline && (
            <p className="text-xs text-[var(--color-text-muted)] mt-2">마감: {job.deadline}</p>
          )}
        </div>

        {/* 외부 링크 아이콘 */}
        <span className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors">
          ↗
        </span>
      </div>
    </a>
  );
}
