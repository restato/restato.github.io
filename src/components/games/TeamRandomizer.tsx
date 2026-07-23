import { useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

interface Team {
  name: string;
  members: string[];
}

export default function TeamRandomizer() {
  const { t } = useTranslation();
  const [members, setMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState('');
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState<Team[]>([]);
  const [bulkInput, setBulkInput] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Add member
  const addMember = () => {
    if (newMember.trim() && members.length < 100) {
      setMembers([...members, newMember.trim()]);
      setNewMember('');
    }
  };

  // Remove member
  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  // Bulk add members
  const handleBulkAdd = () => {
    const names = bulkInput
      .split(/[\n,]/)
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (names.length > 0) {
      setMembers(names.slice(0, 100));
      setBulkInput('');
      setShowBulkInput(false);
    }
  };

  // Shuffle array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Randomize teams
  const randomizeTeams = async () => {
    if (members.length < teamCount) return;

    setIsAnimating(true);
    setTeams([]);

    // Animation effect
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      const shuffled = shuffleArray(members);
      const tempTeams: Team[] = Array(teamCount).fill(null).map((_, idx) => ({
        name: `${t({ ko: '팀', en: 'Team', ja: 'チーム' })} ${idx + 1}`,
        members: [],
      }));

      shuffled.forEach((member, idx) => {
        tempTeams[idx % teamCount].members.push(member);
      });

      setTeams(tempTeams);
    }

    // Final shuffle
    const shuffled = shuffleArray(members);
    const finalTeams: Team[] = Array(teamCount).fill(null).map((_, idx) => ({
      name: `${t({ ko: '팀', en: 'Team', ja: 'チーム' })} ${idx + 1}`,
      members: [],
    }));

    shuffled.forEach((member, idx) => {
      finalTeams[idx % teamCount].members.push(member);
    });

    setTeams(finalTeams);
    setIsAnimating(false);
  };

  // Clear all
  const clearAll = () => {
    setMembers([]);
    setTeams([]);
  };

  return (
    <div className="fc-game mx-auto flex w-full max-w-6xl flex-col gap-6 px-0 lg:flex-row">
      {/* Input Section */}
      <div className="w-full lg:w-96 space-y-4">
        {/* Member Input */}
        <div className="fc-surface p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold">
              {t({ ko: '참가자', en: 'Participants', ja: '参加者' })} ({members.length})
            </h3>
            <button
              type="button"
              onClick={() => setShowBulkInput(!showBulkInput)}
              className="fc-button fc-button-quiet text-sm"
            >
              {t({ ko: '일괄 입력', en: 'Bulk Input', ja: '一括入力' })}
            </button>
          </div>

          {showBulkInput ? (
            <div className="space-y-2">
              <textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder={t({
                  ko: '이름을 줄바꿈 또는 쉼표로 구분하여 입력\n(최대 100명)',
                  en: 'Enter names separated by newlines or commas\n(max 100)',
                  ja: '名前を改行またはカンマで区切って入力\n(最大100人)',
                })}
                className="fc-textarea h-40 text-sm"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleBulkAdd}
                  className="fc-button fc-button-primary flex-1"
                >
                  {t({ ko: '적용', en: 'Apply', ja: '適用' })}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBulkInput(false)}
                  className="fc-button fc-button-secondary"
                >
                  {t({ ko: '취소', en: 'Cancel', ja: 'キャンセル' })}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addMember()}
                  placeholder={t({ ko: '이름 입력', en: 'Enter name', ja: '名前入力' })}
                  className="fc-input flex-1 text-sm"
                  maxLength={30}
                />
                <button
                  type="button"
                  onClick={addMember}
                  disabled={members.length >= 100}
                  className="fc-button fc-button-primary"
                >
                  {t({ ko: '추가', en: 'Add', ja: '追加' })}
                </button>
              </div>

              <div className="space-y-1 max-h-48 overflow-y-auto">
                {members.map((member, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-[var(--color-bg)] rounded-lg text-sm"
                  >
                    <span className="truncate">{member}</span>
                    <button
                      type="button"
                      onClick={() => removeMember(idx)}
                      aria-label={`${member} ${t({ ko: '삭제', en: 'Remove', ja: '削除' })}`}
                      className="fc-button fc-button-quiet ml-2 min-h-11 px-3 text-[var(--accent)]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {members.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="fc-button fc-button-quiet mt-2 text-sm text-[var(--accent)]"
                >
                  {t({ ko: '전체 삭제', en: 'Clear All', ja: 'すべて削除' })}
                </button>
              )}
            </>
          )}
        </div>

        {/* Team Count */}
        <div className="fc-surface p-4">
          <h3 className="font-bold mb-3">
            {t({ ko: '팀 수', en: 'Number of Teams', ja: 'チーム数' })}
          </h3>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setTeamCount(Math.max(2, teamCount - 1))}
              aria-label={t({ ko: '팀 수 줄이기', en: 'Decrease teams', ja: 'チーム数を減らす' })}
              className="fc-button fc-button-secondary h-11 w-11 rounded-full p-0"
            >
              -
            </button>
            <span className="text-3xl font-bold w-12 text-center">{teamCount}</span>
            <button
              type="button"
              onClick={() => setTeamCount(Math.min(8, teamCount + 1))}
              aria-label={t({ ko: '팀 수 늘리기', en: 'Increase teams', ja: 'チーム数を増やす' })}
              className="fc-button fc-button-secondary h-11 w-11 rounded-full p-0"
            >
              +
            </button>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] mt-2">
            {t({ ko: '2~8팀', en: '2-8 teams', ja: '2〜8チーム' })}
          </p>
        </div>

        {/* Randomize Button */}
        <button
          type="button"
          onClick={randomizeTeams}
          disabled={members.length < teamCount || isAnimating}
          className="fc-button fc-button-primary w-full py-4 text-xl"
        >
          {isAnimating
            ? t({ ko: '섞는 중...', en: 'Shuffling...', ja: 'シャッフル中...' })
            : t({ ko: '🎲 팀 나누기!', en: '🎲 Split Teams!', ja: '🎲 チーム分け！' })}
        </button>

        {members.length > 0 && members.length < teamCount && (
          <p className="text-sm text-red-500 text-center">
            {t({
              ko: `참가자가 ${teamCount}명 이상 필요합니다`,
              en: `Need at least ${teamCount} participants`,
              ja: `参加者が${teamCount}人以上必要です`,
            })}
          </p>
        )}
      </div>

      {/* Results Section */}
      <div className="flex-1">
        {teams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((team, idx) => (
              <div
                key={idx}
                className={`fc-surface p-4 ${
                  isAnimating ? 'animate-pulse' : ''
                }`}
              >
                <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="fc-chip h-8 w-8 justify-center text-[var(--accent)]">
                    {idx + 1}
                  </span>
                  {team.name}
                  <span className="text-sm font-normal opacity-75">
                    ({team.members.length}{t({ ko: '명', en: '', ja: '人' })})
                  </span>
                </h4>
                <div className="space-y-1">
                  {team.members.map((member, memberIdx) => (
                    <div
                      key={memberIdx}
                      className="fc-surface-soft rounded-lg px-3 py-2 text-sm"
                    >
                      {member}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-[var(--color-text-muted)]">
            <div className="text-center">
              <div className="text-6xl mb-4">👥</div>
              <p>
                {t({
                  ko: '참가자를 추가하고 팀을 나눠보세요',
                  en: 'Add participants and split into teams',
                  ja: '参加者を追加してチームを分けよう',
                })}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
