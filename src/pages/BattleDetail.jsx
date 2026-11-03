import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BattleCard from '../components/battles/BattleCard';
import BattleLeaderboard from '../components/battles/BattleLeaderboard';
import { getBattle } from '../utils/battles';

export default function BattleDetail() {
  const { battleId } = useParams();
  const battle = getBattle(battleId);

  if (!battle) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-2xl font-bold">Battle not found</h1>
        <Link to="/battles" className="text-audible-orange underline">Back to battles</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Link to="/battles" className="inline-flex items-center gap-2 text-purple-600 font-semibold">
          <ArrowLeft className="w-4 h-4" />
          All battles
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{battle.name}</h1>
        <BattleCard battle={battle} showDetailsLink={false} />
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Leaderboard</h2>
          <BattleLeaderboard leaderboard={battle.leaderboard} battleType={battle.type} showFull />
        </section>
      </div>
    </div>
  );
}
