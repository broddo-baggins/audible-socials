import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swords, Zap, Target, Search } from 'lucide-react';
import BattleCard from '../components/battles/BattleCard';
import BattleLeaderboard from '../components/battles/BattleLeaderboard';
import { PageHeader, EmptyState } from '../components/ui';
import { getBattles } from '../utils/battles';

/**
 * Battles: friendly competitions around books. Opens with the plain numbers,
 * then tabs by status, type chips and a search, a list of battles, and the
 * champions of the active ones.
 */
export default function Battles() {
  const [battles] = useState(() => getBattles());
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const showAllBattles = () => {
    setActiveTab('all');
    setSearchQuery('');
    setFilterType('all');
  };

  const filteredBattles = battles.filter(battle => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' && battle.status === 'active') ||
      (activeTab === 'upcoming' && battle.status === 'upcoming') ||
      (activeTab === 'completed' && battle.status === 'completed');

    const matchesSearch = battle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         battle.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' || battle.type === filterType;

    return matchesTab && matchesSearch && matchesType;
  });

  const battleTypes = [
    { id: 'all', label: 'All types', icon: null },
    { id: 'speed_reading', label: 'Speed reading', icon: Zap },
    { id: 'book_voting', label: 'Book voting', icon: Swords },
    { id: 'streak_challenge', label: 'Streak challenge', icon: Target },
  ];

  const tabs = [
    { id: 'all', label: 'All', count: battles.length },
    { id: 'active', label: 'Active', count: battles.filter(b => b.status === 'active').length },
    { id: 'upcoming', label: 'Upcoming', count: battles.filter(b => b.status === 'upcoming').length },
    { id: 'completed', label: 'Completed', count: battles.filter(b => b.status === 'completed').length },
  ];

  const totalParticipants = battles.reduce((sum, battle) => sum + (battle.participants?.length || 0), 0);
  const activeBattles = battles.filter(b => b.status === 'active').length;

  const onTabKeyDown = (e, index) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (index + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
    setActiveTab(tabs[next].id);
    document.getElementById(`battles-tab-${tabs[next].id}`)?.focus();
  };

  return (
    <div className="page pb-16">
      <PageHeader
        title="Book battles"
        description="Race friends to the last chapter, vote on the better book or keep a daily listening streak. Winners take credits and badges."
        actions={
          <Link
            to="/clubs/friends"
            className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-[0.9375rem] font-medium text-paper hover:bg-gray-800"
          >
            Find friends to battle
          </Link>
        }
      >
        <dl className="flex flex-wrap gap-x-12 gap-y-4">
          <div className="flex flex-col-reverse justify-end">
            <dt className="t-meta mt-1">Active battles</dt>
            <dd className="t-h1 tabular text-ink">{activeBattles}</dd>
          </div>
          <div className="flex flex-col-reverse justify-end">
            <dt className="t-meta mt-1">Participants in all battles</dt>
            <dd className="t-h1 tabular text-ink">{totalParticipants.toLocaleString()}</dd>
          </div>
          <div className="flex flex-col-reverse justify-end">
            <dt className="t-meta mt-1">Credits awarded</dt>
            <dd className="t-h1 tabular text-ink">10K+</dd>
          </div>
        </dl>
      </PageHeader>

      {/* Tabs by status */}
      <div role="tablist" aria-label="Battles by status" className="flex gap-6 overflow-x-auto border-b border-line scrollbar-hide">
        {tabs.map((tab, index) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`battles-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="battles-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => onTabKeyDown(e, index)}
              className={`relative inline-flex h-12 shrink-0 items-center gap-1.5 text-[0.9375rem] font-medium transition-colors ${selected ? 'text-ink' : 'text-ink-2 hover:text-ink'}`}
            >
              {tab.label}
              <span className="text-[0.8125rem] text-ink-3 tabular">{tab.count}</span>
              {selected && <span className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-hl" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {/* Search and type filters */}
      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <label htmlFor="battle-search" className="sr-only">Search battles</label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" strokeWidth={1.75} aria-hidden="true" />
          <input
            id="battle-search"
            type="search"
            placeholder="Search battles"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-full border border-line-strong bg-surface pl-10 pr-4 text-[0.9375rem] text-ink focus:border-ink focus:shadow-[0_0_0_3px_var(--hl)] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Battle type">
          {battleTypes.map((type) => {
            const selected = filterType === type.id;
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setFilterType(type.id)}
                aria-pressed={selected}
                className={`inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors ${
                  selected ? 'bg-hl text-ink' : 'border border-line-strong text-ink hover:bg-surface'
                }`}
              >
                {Icon && <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Battle list */}
      <div id="battles-panel" role="tabpanel" aria-labelledby={`battles-tab-${activeTab}`} className="mt-4">
        {filteredBattles.length > 0 ? (
          <div className="divide-y divide-line border-b border-line">
            {filteredBattles.map((battle) => (
              <BattleCard key={battle.id} battle={battle} />
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-6"
            title="No battles match"
            description="Try another search or a different type."
            action="Show all battles"
            onAction={showAllBattles}
          />
        )}
      </div>

      {/* Global leaderboard */}
      {activeTab === 'active' && (
        <section aria-labelledby="battle-champions" className="mt-16 md:mt-20">
          <h2 id="battle-champions" className="t-h2 text-ink">Battle champions</h2>
          <p className="mt-1 text-[0.9375rem] text-ink-2">Top listeners across all active battles.</p>

          <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-14">
            <div>
              <h3 className="t-h3 flex items-center gap-2 text-ink">
                <Zap className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                Speed reading
              </h3>
              <div className="mt-2">
                <BattleLeaderboard
                  leaderboard={[
                    { userId: '1', username: 'BookWarrior92', score: 1200, completionTime: '18 days' },
                    { userId: '2', username: 'ReadingQueen', score: 980, completionTime: '22 days' },
                    { userId: '3', username: 'SpeedReaderX', score: 1450, completionTime: '15 days' }
                  ]}
                  battleType="speed_reading"
                />
              </div>
            </div>

            <div>
              <h3 className="t-h3 flex items-center gap-2 text-ink">
                <Target className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                Streaks
              </h3>
              <div className="mt-2">
                <BattleLeaderboard
                  leaderboard={[
                    { userId: '4', username: 'StreakKing', score: 2800, currentStreak: 28 },
                    { userId: '5', username: 'DailyListener', score: 2100, currentStreak: 21 },
                    { userId: '6', username: 'ConsistencyQueen', score: 1950, currentStreak: 19 }
                  ]}
                  battleType="streak_challenge"
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
