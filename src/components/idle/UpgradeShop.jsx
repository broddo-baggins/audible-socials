import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, Lock, Sparkles } from 'lucide-react';
import { UPGRADES, isUpgradeAvailable } from '../../utils/idleGame';

/**
 * UpgradeShop - Interface for purchasing upgrades with Focus Points
 */
const UpgradeShop = ({ gameState, onPurchase, showShop, onToggleShop }) => {
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  // Group upgrades by category
  const categories = {
    equipment: [],
    furniture: [],
    consumable: []
  };

  Object.values(UPGRADES).forEach(upgrade => {
    if (categories[upgrade.category]) {
      categories[upgrade.category].push(upgrade);
    }
  });

  const categoryNames = {
    equipment: '🎧 Equipment',
    furniture: '🪑 Furniture',
    consumable: '☕ Consumables'
  };

  return (
    <div>
      {/* Toggle Button */}
      <motion.button
        onClick={onToggleShop}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg py-3 px-4 flex items-center justify-center gap-2 transition-colors shadow-lg"
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
      >
        <ShoppingCart className="w-5 h-5 text-white" />
        <span className="text-white font-bold">
          Upgrade Shop
        </span>
        <Sparkles className="w-4 h-4 text-yellow-300" />
      </motion.button>

      {/* Shop Interface */}
      <AnimatePresence>
        {showShop && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-4 overflow-hidden"
          >
            {Object.entries(categories).map(([category, upgrades]) => (
              <div key={category}>
                <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                  <span>{categoryNames[category]}</span>
                </h3>
                <div className="space-y-2">
                  {upgrades.map(upgrade => {
                    const isPurchased = gameState.purchasedUpgrades.includes(upgrade.id);
                    const canAfford = gameState.focusPoints >= upgrade.cost;
                    const meetsRequirements = !upgrade.requires || 
                      gameState.purchasedUpgrades.includes(upgrade.requires);
                    const isAvailable = isUpgradeAvailable(upgrade.id, gameState);

                    return (
                      <motion.button
                        key={upgrade.id}
                        onClick={() => isAvailable && onPurchase(upgrade.id)}
                        disabled={!isAvailable || isPurchased}
                        className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${
                          isPurchased
                            ? 'bg-green-600/30 border-2 border-green-500'
                            : isAvailable
                            ? 'bg-white/10 hover:bg-white/20 border-2 border-blue-400/50'
                            : 'bg-gray-700/30 cursor-not-allowed border-2 border-gray-600/30'
                        }`}
                        variants={buttonVariants}
                        initial="idle"
                        whileHover={isAvailable && !isPurchased ? "hover" : "idle"}
                        whileTap={isAvailable && !isPurchased ? "tap" : "idle"}
                        layout
                      >
                        {/* Icon */}
                        <div className="text-3xl">{upgrade.icon}</div>

                        {/* Details */}
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-white text-sm flex items-center gap-2">
                            {upgrade.name}
                            {isPurchased && (
                              <Check className="w-4 h-4 text-green-400" />
                            )}
                          </div>
                          <div className="text-xs text-white/70">{upgrade.description}</div>
                          
                          {/* Requirements */}
                          {upgrade.requires && !meetsRequirements && (
                            <div className="text-xs text-red-400 mt-1 flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              Requires: {UPGRADES[upgrade.requires]?.name}
                            </div>
                          )}
                        </div>

                        {/* Cost */}
                        <div className="text-right">
                          {isPurchased ? (
                            <div className="text-green-400 font-bold text-sm">Owned</div>
                          ) : (
                            <div className={`font-bold text-sm ${
                              canAfford && meetsRequirements ? 'text-blue-400' : 'text-red-400'
                            }`}>
                              <div className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                {upgrade.cost}
                              </div>
                              <div className="text-xs text-white/50">FP</div>
                            </div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Current Balance */}
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-sm text-white/70 mb-1">Your Focus Points</div>
              <div className="text-2xl font-bold text-blue-400 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                {gameState.focusPoints.toLocaleString()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UpgradeShop;

