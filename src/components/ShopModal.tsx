import React, { useState } from 'react';
import { InventoryItem } from '../types/game';
import { SHOP_CATALOG } from '../data/shop';
import { soundManager } from '../services/audio';
import {
  Coins,
  HeartPulse,
  BatteryCharging,
  Wind,
  Gem,
  Check,
  AlertCircle,
  PackageCheck,
} from 'lucide-react';

interface ShopModalProps {
  coins: number;
  health: number;
  inventory: InventoryItem[];
  onBuyItem: (item: InventoryItem) => { success: boolean; message: string };
  onUseItem: (itemId: string) => { success: boolean; message: string };
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  coins,
  inventory,
  onBuyItem,
  onUseItem,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'inventory'>('buy');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(
    null
  );

  const getItemIcon = (name: string) => {
    switch (name) {
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5 text-rose-400" />;
      case 'BatteryCharging':
        return <BatteryCharging className="w-5 h-5 text-amber-400" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-cyan-400" />;
      case 'Diamond':
        return <Gem className="w-5 h-5 text-cyan-300" />;
      default:
        return <PackageCheck className="w-5 h-5 text-neutral-400" />;
    }
  };

  const handleBuy = (item: InventoryItem) => {
    const res = onBuyItem(item);
    if (res.success) {
      soundManager.playSuccess();
      setStatusMessage({ text: res.message, isError: false });
    } else {
      soundManager.playFailure();
      setStatusMessage({ text: res.message, isError: true });
    }
  };

  const handleUse = (itemId: string) => {
    const res = onUseItem(itemId);
    if (res.success) {
      soundManager.playSuccess();
      setStatusMessage({ text: res.message, isError: false });
    } else {
      soundManager.playFailure();
      setStatusMessage({ text: res.message, isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono-code text-amber-400 uppercase tracking-wider font-semibold">
                Quartermaster Supply Depot
              </span>
            </div>
            <h2 className="text-lg font-bold font-display text-neutral-100">
              Mars Base Emergency Requisition Shop
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-mono-code">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="font-bold text-yellow-300">{coins} Coins</span>
            </div>

            <div className="flex bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs font-medium">
              <button
                onClick={() => {
                  setActiveTab('buy');
                  setStatusMessage(null);
                }}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                  activeTab === 'buy'
                    ? 'bg-neutral-800 text-amber-300'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Buy Supplies
              </button>
              <button
                onClick={() => {
                  setActiveTab('inventory');
                  setStatusMessage(null);
                }}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                  activeTab === 'inventory'
                    ? 'bg-neutral-800 text-amber-300'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Inventory ({inventory.reduce((acc, i) => acc + i.quantity, 0)})
              </button>
            </div>
          </div>
        </div>

        {/* Status notification toast */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 animate-in fade-in ${
              statusMessage.isError
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            }`}
          >
            {statusMessage.isError ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Tab 1: Buy Supplies */}
        {activeTab === 'buy' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {SHOP_CATALOG.map(item => {
              const canAfford = coins >= item.cost;
              return (
                <div
                  key={item.id}
                  className="bg-neutral-950/80 border border-neutral-800 hover:border-neutral-700 rounded-xl p-4 flex flex-col justify-between gap-3 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 shrink-0">
                      {getItemIcon(item.iconName)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-neutral-100">{item.name}</h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-neutral-900">
                    <div className="flex items-center gap-1.5 font-mono-code text-xs text-yellow-300 font-bold">
                      <Coins className="w-3.5 h-3.5 text-yellow-400" />
                      <span>{item.cost} coins</span>
                    </div>

                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-sm'
                          : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Requisition' : 'Need Coins'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Tab 2: Inventory */
          <div className="flex flex-col gap-3">
            {inventory.length === 0 || inventory.every(i => i.quantity === 0) ? (
              <div className="p-8 text-center text-xs text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
                No emergency equipment in inventory. Visit the "Buy Supplies" tab to requisition Health Kits or Power Cells.
              </div>
            ) : (
              inventory
                .filter(i => i.quantity > 0)
                .map(item => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-neutral-950/80 border border-neutral-800 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                        {getItemIcon(item.iconName)}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-neutral-200">
                          {item.name} <span className="text-neutral-500 font-mono-code font-normal">x{item.quantity}</span>
                        </div>
                        <div className="text-[11px] text-neutral-400">{item.description}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleUse(item.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition cursor-pointer"
                    >
                      Apply Now
                    </button>
                  </div>
                ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
          <div className="text-[11px] text-neutral-400 font-mono-code">
            STANDARD ISSUE: Health Kit restores +25% Health (cap: 100%).
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-xl text-xs transition cursor-pointer"
          >
            Close Depot
          </button>
        </div>
      </div>
    </div>
  );
};
