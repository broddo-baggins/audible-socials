import bookBattlesData from '../data/bookBattles.json';
import { getJoinedBattles } from './localStorage';

// The mock battles are authored for December 2025. Shift every date by whole
// months so that month lines up with the current month: "active" battles stay
// active and "upcoming" ones stay in the future, whenever the demo is opened.
const AUTHORED_MONTH = new Date(2025, 11, 1);

const shiftDate = (iso, months) => {
  const date = new Date(iso);
  date.setMonth(date.getMonth() + months);
  return date.toISOString();
};

export function getBattles(now = new Date()) {
  const months = (now.getFullYear() - AUTHORED_MONTH.getFullYear()) * 12 + (now.getMonth() - AUTHORED_MONTH.getMonth());
  return bookBattlesData.map(battle => ({
    ...battle,
    startDate: shiftDate(battle.startDate, months),
    endDate: shiftDate(battle.endDate, months),
  }));
}

export function getBattle(battleId, now = new Date()) {
  return getBattles(now).find(battle => battle.id === battleId) || null;
}

export function hasJoinedBattle(battle, userId) {
  return Boolean(battle.participants?.includes(userId) || getJoinedBattles().includes(battle.id));
}
