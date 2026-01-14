import type { JobSiteStatus } from '../../types/jobs';
import { jobSites } from '../../data/jobSites';

interface JobSiteCardProps {
  status: JobSiteStatus;
  onClick: () => void;
  isSelected: boolean;
}

export default function JobSiteCard({ status, onClick, isSelected }: JobSiteCardProps) {
  const site = jobSites.find((s) => s.id === status.siteId);
  const isLinkOnly = status.status === 'link-only';

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 text-left w-full
        ${
          isSelected
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)] bg-[var(--color-card)]'
        }
      `}
    >
      {/* 회사 로고 */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
        style={{ backgroundColor: site?.color || '#666' }}
      >
        {status.siteName.charAt(0)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[var(--color-text)]">{status.siteName}</span>
          {/* 상태 표시 */}
          {status.status === 'loading' && (
            <span className="animate-spin text-xs">⏳</span>
          )}
          {status.status === 'success' && (
            <span className="text-green-500 text-xs">✓</span>
          )}
          {status.status === 'error' && (
            <span className="text-red-500 text-xs" title={status.error}>
              ✕
            </span>
          )}
          {isLinkOnly && (
            <span className="text-yellow-500 text-xs" title="직접 방문 필요">
              🔗
            </span>
          )}
        </div>

        <div className="text-sm text-[var(--color-text-muted)]">
          {status.status === 'loading' && '로딩 중...'}
          {status.status === 'success' && `${status.jobCount}개 채용공고`}
          {status.status === 'error' && '불러오기 실패'}
          {isLinkOnly && '직접 방문'}
        </div>
      </div>

      {/* 선택 표시 */}
      {isSelected && (
        <span className="text-blue-500 text-lg">✓</span>
      )}
    </button>
  );
}
