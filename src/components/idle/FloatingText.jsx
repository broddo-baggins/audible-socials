import { motion as Motion, AnimatePresence } from 'framer-motion';

/**
 * FloatingText: small receipts for what you just earned (XP, focus points,
 * an upgrade, a level). Ink pills that rise a little and fade; experience
 * gains carry the highlighter. Decorative copies of state the panel already shows.
 */
const STYLES = {
  xp: 'bg-hl text-ink',
  level: 'bg-hl text-ink',
  fp: 'bg-ink text-paper',
  upgrade: 'bg-ink text-paper',
  achievement: 'bg-ink text-paper',
  info: 'bg-surface text-ink border border-line',
};

const FloatingText = ({ items }) => (
  <div className="pointer-events-none fixed inset-0 z-50" aria-hidden="true">
    <AnimatePresence>
      {items.map((item) => (
        <Motion.div
          key={item.id}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: -48 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute whitespace-nowrap rounded-full px-3 py-1 text-sm font-semibold tabular shadow-md ${STYLES[item.type] || STYLES.info}`}
          style={{ left: `${item.x}px`, top: `${item.y}px` }}
        >
          {item.text}
        </Motion.div>
      ))}
    </AnimatePresence>
  </div>
);

export default FloatingText;
