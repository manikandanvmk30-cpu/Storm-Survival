import React, { useState, useEffect } from 'react';
import { HomeAppliancesState, SurvivalStats } from '../types/survival';
import { HomeStructure, HomeMaterials } from '../types/game';
import { soundManager } from '../services/audio';
import {
  Tv,
  Refrigerator,
  Lightbulb,
  Fan,
  Radio,
  Zap,
  Coffee,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Flame,
  Droplet,
  Power,
  ArrowRight,
  BatteryCharging,
} from 'lucide-react';

interface HomeAppliancesModalProps {
  appliances: HomeAppliancesState;
  stats: SurvivalStats;
  homeStructure: HomeStructure;
  materials: HomeMaterials;
  isInsideShelter: boolean;
  onUpdateAppliances: (updater: (prev: HomeAppliancesState) => HomeAppliancesState) => void;
  onUpdateStats: (updater: (prev: SurvivalStats) => SurvivalStats) => void;
  onOpenRebuildModal: () => void;
  onClose: () => void;
}

const TV_CHANNELS = [
  {
    id: 0,
    name: '🛰️ Cyclone Radar & Satellite Weather',
    subtext: 'IMD Coastal Doppler Radar Tracking Active Gale Front',
    bgClass: 'from-blue-950 via-slate-900 to-indigo-950',
    headline: 'IMD RED ALERT: Severe Cyclone warning for Tamil Nadu coastal regions. Wind speeds 95-120 km/h. Residents advised to remain indoors.',
  },
  {
    id: 1,
    name: '📢 TN Disaster Management Emergency Bulletin',
    subtext: 'State Emergency Operations Center (SEOC)',
    bgClass: 'from-amber-950 via-red-950 to-slate-950',
    headline: 'EMERGENCY PROTOCOL: Ensure battery backup is charged. Keep drinking water and first aid kits secured inside fortified shelters.',
  },
  {
    id: 2,
    name: '🌍 National Geographic: Earth & India',
    subtext: 'Bay of Bengal Geography & Tropical Weather Ecology',
    bgClass: 'from-emerald-950 via-teal-950 to-slate-950',
    headline: 'DOCUMENTARY: Mangrove forests of Pichavaram and coastal Tamil Nadu act as natural bio-shields buffering cyclonic sea surges.',
  },
  {
    id: 3,
    name: '🦸 Marvel Superhero News Network',
    subtext: 'Daily Bugle / Avengers Coastal Task Force',
    bgClass: 'from-purple-950 via-violet-950 to-slate-950',
    headline: 'HERO UPDATE: Spider-Man, Thor, and Iron Man deployed to island sector to reinforce civilian shelters and clear storm debris.',
  },
];

export const HomeAppliancesModal: React.FC<HomeAppliancesModalProps> = ({
  appliances,
  stats,
  homeStructure,
  materials,
  isInsideShelter,
  onUpdateAppliances,
  onUpdateStats,
  onOpenRebuildModal,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'tv' | 'fridge' | 'lights' | 'fan' | 'kitchen'>('all');
  const [messageNotice, setMessageNotice] = useState<string | null>(null);

  // Auto clear message
  useEffect(() => {
    if (messageNotice) {
      const t = setTimeout(() => setMessageNotice(null), 3500);
      return () => clearTimeout(t);
    }
  }, [messageNotice]);

  // Toggle Light Switch
  const handleToggleLightSwitch = () => {
    soundManager.playSwitchClick();
    onUpdateAppliances(prev => {
      const nextState = !prev.lightSwitch.turnedOn;
      setMessageNotice(nextState ? '💡 Wall Switch flipped ON: Ceiling lights glowing warm!' : '🌑 Wall Switch flipped OFF: Lights dimmed');
      return {
        ...prev,
        lightSwitch: {
          ...prev.lightSwitch,
          turnedOn: nextState,
        },
      };
    });
  };

  // Adjust Light Brightness
  const handleBrightnessChange = (val: number) => {
    onUpdateAppliances(prev => ({
      ...prev,
      lightSwitch: {
        ...prev.lightSwitch,
        brightness: val,
      },
    }));
  };

  // Toggle TV Power
  const handleToggleTv = () => {
    soundManager.playTvChime();
    onUpdateAppliances(prev => {
      const nextState = !prev.tv.powered;
      setMessageNotice(nextState ? '📺 Smart TV powered ON! Broadcast streaming.' : '📺 TV turned OFF');
      return {
        ...prev,
        tv: {
          ...prev.tv,
          powered: nextState,
        },
      };
    });
  };

  // Change TV Channel
  const handleNextChannel = () => {
    soundManager.playTvChime();
    onUpdateAppliances(prev => {
      const nextIdx = (prev.tv.channel + 1) % TV_CHANNELS.length;
      return {
        ...prev,
        tv: {
          ...prev.tv,
          channel: nextIdx,
          channelName: TV_CHANNELS[nextIdx].name,
        },
      };
    });
  };

  // Toggle Fridge Door
  const handleToggleFridgeDoor = () => {
    soundManager.playFridgeDoor();
    onUpdateAppliances(prev => {
      const nextDoor = !prev.fridge.doorOpen;
      return {
        ...prev,
        fridge: {
          ...prev.fridge,
          doorOpen: nextDoor,
        },
      };
    });
  };

  // Drink Cold Water from Fridge
  const handleDrinkColdWater = () => {
    if (appliances.fridge.coldWaterCount <= 0) {
      setMessageNotice('⚠️ Fridge water empty! Stock more water from the island.');
      return;
    }
    soundManager.playDrink();
    onUpdateAppliances(prev => ({
      ...prev,
      fridge: {
        ...prev.fridge,
        coldWaterCount: Math.max(0, prev.fridge.coldWaterCount - 1),
      },
    }));
    onUpdateStats(prev => ({
      ...prev,
      water: Math.min(100, prev.water + 30),
      health: Math.min(100, prev.health + 5),
    }));
    setMessageNotice('💧 Drank Chilled Filtered Water: +30% Hydration!');
  };

  // Eat Protein Snack from Fridge
  const handleEatSnackFromFridge = () => {
    if (appliances.fridge.snacksCount <= 0) {
      setMessageNotice('⚠️ Fridge snacks empty! Gather canned rations or coconuts from the island.');
      return;
    }
    soundManager.playEat();
    onUpdateAppliances(prev => ({
      ...prev,
      fridge: {
        ...prev.fridge,
        snacksCount: Math.max(0, prev.fridge.snacksCount - 1),
      },
    }));
    onUpdateStats(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 30),
      energy: Math.min(100, prev.energy + 10),
    }));
    setMessageNotice('🥪 Ate Chilled Protein Sandwich: +30% Hunger, +10% Energy!');
  };

  // Toggle Ceiling Fan
  const handleToggleFan = () => {
    soundManager.playSwitchClick();
    onUpdateAppliances(prev => {
      const nextOn = !prev.fan.turnedOn;
      setMessageNotice(nextOn ? '🌀 Ceiling Fan active: Cooling breeze circulating!' : '🌀 Ceiling Fan stopped');
      return {
        ...prev,
        fan: {
          ...prev.fan,
          turnedOn: nextOn,
        },
      };
    });
  };

  // Change Fan Speed
  const handleSetFanSpeed = (spd: number) => {
    soundManager.playSwitchClick();
    onUpdateAppliances(prev => ({
      ...prev,
      fan: {
        ...prev.fan,
        turnedOn: true,
        speed: spd,
      },
    }));
  };

  // Microwave Cook Meal
  const handleCookMicrowaveMeal = () => {
    if (appliances.microwave.isCooking) return;
    soundManager.playSwitchClick();
    onUpdateAppliances(prev => ({
      ...prev,
      microwave: {
        isCooking: true,
        timeLeftSeconds: 5,
      },
    }));
    setMessageNotice('♨️ Microwave heating fresh hearty dinner (5s)...');

    setTimeout(() => {
      soundManager.playMicrowaveDing();
      soundManager.playEat();
      onUpdateAppliances(prev => ({
        ...prev,
        microwave: {
          isCooking: false,
          timeLeftSeconds: 0,
        },
      }));
      onUpdateStats(prev => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + 40),
        health: Math.min(100, prev.health + 20),
        energy: Math.min(100, prev.energy + 15),
      }));
      setMessageNotice('🍽️ Hot Fresh Meal Cooked! +40% Hunger, +20% Health, +15% Energy!');
    }, 4500);
  };

  // Rest on Living Room Sofa
  const handleRestOnSofa = () => {
    soundManager.playSuccess();
    onUpdateStats(prev => ({
      ...prev,
      energy: 100,
      health: Math.min(100, prev.health + 15),
    }));
    setMessageNotice('🛋️ Rested on living room sofa: Energy fully restored to 100%!');
  };

  const currentChannel = TV_CHANNELS[appliances.tv.channel] || TV_CHANNELS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl flex flex-col text-neutral-100">
        {/* Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-neutral-900/95 border-b border-neutral-800 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xl">
              🏠
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg text-white">
                  Home Interior & Smart Appliances
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Stage {homeStructure.level}/5
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Interactive living room with TV, fridge, light switch, ceiling fan, microwave & solar backup.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenRebuildModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upgrade House</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Temporary Notice Toast */}
        {messageNotice && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs font-medium flex items-center justify-between animate-fadeIn">
            <span>{messageNotice}</span>
            <button
              onClick={() => setMessageNotice(null)}
              className="text-amber-400 hover:text-white ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* Ambient Room Lighting Glow simulation based on Light Switch */}
        <div
          className={`px-6 py-4 transition-all duration-500 ${
            appliances.lightSwitch.turnedOn
              ? 'bg-gradient-to-b from-amber-500/10 via-transparent to-transparent'
              : 'bg-gradient-to-b from-neutral-950/60 via-transparent to-transparent'
          }`}
        >
          {/* Quick Status Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            <div className="p-2.5 rounded-xl bg-neutral-800/70 border border-neutral-700/60 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-sm">
                🛡️
              </div>
              <div>
                <div className="text-[10px] text-neutral-400 uppercase font-semibold">Shelter Health</div>
                <div className="text-sm font-bold text-white">{Math.round(stats.shelterStrength)}%</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-neutral-800/70 border border-neutral-700/60 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-sm">
                ⚡
              </div>
              <div>
                <div className="text-[10px] text-neutral-400 uppercase font-semibold">Solar Inverter</div>
                <div className="text-sm font-bold text-amber-300">100% Online</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-neutral-800/70 border border-neutral-700/60 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center font-bold text-sm">
                💡
              </div>
              <div>
                <div className="text-[10px] text-neutral-400 uppercase font-semibold">Light Switch</div>
                <div className="text-sm font-bold text-white">
                  {appliances.lightSwitch.turnedOn ? 'ON (Warm)' : 'OFF (Dim)'}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-neutral-800/70 border border-neutral-700/60 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center font-bold text-sm">
                🛋️
              </div>
              <button
                onClick={handleRestOnSofa}
                className="text-left hover:opacity-80 transition-opacity"
              >
                <div className="text-[10px] text-neutral-400 uppercase font-semibold">Rest On Sofa</div>
                <div className="text-xs font-bold text-rose-300 underline">Recover Energy →</div>
              </button>
            </div>
          </div>

          {/* MAIN APPLIANCES DISPLAY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. SMART TV */}
            <div className="p-4 rounded-xl bg-neutral-800/80 border border-neutral-700/80 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Tv className="w-5 h-5 text-sky-400" />
                    <h3 className="font-semibold text-sm text-white">Smart Television (TV)</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleTv}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors ${
                        appliances.tv.powered
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      <span>{appliances.tv.powered ? 'Power Off' : 'Turn On'}</span>
                    </button>
                  </div>
                </div>

                {/* TV Screen Display */}
                <div
                  className={`relative w-full h-44 rounded-lg border-2 overflow-hidden flex flex-col justify-between p-3.5 transition-all ${
                    appliances.tv.powered
                      ? `border-sky-500/60 bg-gradient-to-br ${currentChannel.bgClass} shadow-[0_0_20px_rgba(56,189,248,0.25)]`
                      : 'border-neutral-800 bg-neutral-950 text-neutral-600'
                  }`}
                >
                  {appliances.tv.powered ? (
                    <>
                      <div className="flex items-center justify-between z-10">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-300">
                            LIVE BROADCAST · CH {appliances.tv.channel + 1}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-sky-300">
                          {currentChannel.subtext}
                        </span>
                      </div>

                      {/* TV Channel Center Graphic */}
                      <div className="my-auto text-center z-10">
                        <div className="text-xl sm:text-2xl font-bold text-white mb-1 drop-shadow-md">
                          {currentChannel.name}
                        </div>
                        <p className="text-xs text-neutral-200 line-clamp-2 max-w-md mx-auto">
                          {currentChannel.headline}
                        </p>
                      </div>

                      {/* Bottom Live Ticker */}
                      <div className="bg-black/60 -mx-3.5 -mb-3.5 px-3 py-1 text-[10px] text-amber-300 font-mono overflow-hidden whitespace-nowrap z-10 border-t border-white/10">
                        <span className="font-bold mr-2 text-white">BREAKING:</span>
                        {currentChannel.headline}
                      </div>

                      {/* Subtle scanline effect */}
                      <div className="absolute inset-0 pointer-events-none opacity-15 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.4)_2px,rgba(255,255,255,0.4)_4px)]" />
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-600">
                      <Tv className="w-8 h-8 mb-1 opacity-40" />
                      <span className="text-xs font-mono">TV IS STANDBY (CLICK TURN ON)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* TV Control Buttons */}
              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  onClick={handleNextChannel}
                  disabled={!appliances.tv.powered}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-neutral-700/80 hover:bg-neutral-600 text-neutral-200 transition-colors disabled:opacity-40"
                >
                  Next Channel (1-4)
                </button>
                <div className="flex gap-1">
                  {TV_CHANNELS.map((ch, idx) => (
                    <button
                      key={ch.id}
                      onClick={() => {
                        soundManager.playTvChime();
                        onUpdateAppliances(prev => ({
                          ...prev,
                          tv: { ...prev.tv, powered: true, channel: idx, channelName: ch.name },
                        }));
                      }}
                      className={`w-7 h-7 rounded text-xs font-bold transition-all ${
                        appliances.tv.powered && appliances.tv.channel === idx
                          ? 'bg-sky-500 text-neutral-950 font-black'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. REFRIGERATOR (FRIDGE) */}
            <div className="p-4 rounded-xl bg-neutral-800/80 border border-neutral-700/80 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Refrigerator className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-semibold text-sm text-white">Smart Double-Door Fridge</h3>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-mono rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    Temp: {appliances.fridge.temperatureC}°C
                  </span>
                </div>

                {/* Fridge Door / Interior Graphic */}
                <div
                  className={`w-full h-44 rounded-lg border-2 p-3 flex flex-col justify-between transition-all ${
                    appliances.fridge.doorOpen
                      ? 'border-cyan-500/60 bg-gradient-to-b from-cyan-950/40 via-neutral-900 to-cyan-950/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'border-neutral-700 bg-neutral-900'
                  }`}
                >
                  {appliances.fridge.doorOpen ? (
                    <div className="flex flex-col h-full justify-between">
                      <div className="flex items-center justify-between text-xs text-cyan-300 border-b border-cyan-500/20 pb-1">
                        <span className="font-semibold">❄️ Inside Refrigerator Shelves</span>
                        <span className="text-[10px] text-neutral-400">LED Frost Illumination</span>
                      </div>

                      {/* Items on shelf */}
                      <div className="grid grid-cols-2 gap-2 my-auto">
                        <div className="p-2 rounded-lg bg-neutral-800/90 border border-neutral-700 flex flex-col items-center text-center">
                          <span className="text-2xl mb-1">💧</span>
                          <span className="text-xs font-bold text-white">Chilled Water</span>
                          <span className="text-[10px] text-neutral-400 mb-2">
                            Stock: {appliances.fridge.coldWaterCount} bottles
                          </span>
                          <button
                            onClick={handleDrinkColdWater}
                            disabled={appliances.fridge.coldWaterCount <= 0}
                            className="w-full py-1 text-[11px] font-semibold rounded bg-cyan-600 hover:bg-cyan-500 text-white transition-colors disabled:opacity-40"
                          >
                            Drink (+30 Water)
                          </button>
                        </div>

                        <div className="p-2 rounded-lg bg-neutral-800/90 border border-neutral-700 flex flex-col items-center text-center">
                          <span className="text-2xl mb-1">🥪</span>
                          <span className="text-xs font-bold text-white">Protein Snack</span>
                          <span className="text-[10px] text-neutral-400 mb-2">
                            Stock: {appliances.fridge.snacksCount} packs
                          </span>
                          <button
                            onClick={handleEatSnackFromFridge}
                            disabled={appliances.fridge.snacksCount <= 0}
                            className="w-full py-1 text-[11px] font-semibold rounded bg-amber-600 hover:bg-amber-500 text-white transition-colors disabled:opacity-40"
                          >
                            Eat (+30 Hunger)
                          </button>
                        </div>
                      </div>

                      <div className="text-[10px] text-center text-neutral-400">
                        Restocks when collecting food & clean water across the island.
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-400">
                      <div className="w-20 h-28 border border-neutral-600 rounded bg-gradient-to-r from-neutral-800 to-neutral-700 relative shadow-inner flex items-center justify-end pr-2">
                        <div className="w-1.5 h-10 bg-neutral-400 rounded-full" />
                      </div>
                      <span className="text-xs font-medium mt-2">Fridge Door Closed</span>
                      <span className="text-[10px] text-neutral-500">Click below to open and take chilled supplies</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Fridge Toggle Button */}
              <div className="mt-3">
                <button
                  onClick={handleToggleFridgeDoor}
                  className={`w-full py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                    appliances.fridge.doorOpen
                      ? 'bg-neutral-700 hover:bg-neutral-600 text-white'
                      : 'bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-200 border border-cyan-500/40'
                  }`}
                >
                  <Refrigerator className="w-3.5 h-3.5" />
                  <span>{appliances.fridge.doorOpen ? 'Close Fridge Door' : 'Open Fridge Door'}</span>
                </button>
              </div>
            </div>

            {/* 3. WALL LIGHT SWITCH & LIGHTING */}
            <div className="p-4 rounded-xl bg-neutral-800/80 border border-neutral-700/80 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-400" />
                    <h3 className="font-semibold text-sm text-white">Wall Light Switch & Ceiling Lighting</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-xs font-bold rounded ${
                      appliances.lightSwitch.turnedOn
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {appliances.lightSwitch.turnedOn ? 'SWITCH ON' : 'SWITCH OFF'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg bg-neutral-900 border border-neutral-700/80">
                  {/* Big Clickable Wall Rocker Switch */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={handleToggleLightSwitch}
                      className={`w-16 h-28 rounded-xl p-1.5 flex flex-col justify-between transition-all shadow-inner border-2 ${
                        appliances.lightSwitch.turnedOn
                          ? 'bg-amber-500/30 border-amber-400'
                          : 'bg-neutral-800 border-neutral-600'
                      }`}
                      title="Click to toggle switch"
                    >
                      <div
                        className={`w-full h-11 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                          appliances.lightSwitch.turnedOn
                            ? 'bg-amber-400 text-neutral-950 shadow-md font-black translate-y-0'
                            : 'bg-neutral-700 text-neutral-400'
                        }`}
                      >
                        ON
                      </div>
                      <div
                        className={`w-full h-11 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                          !appliances.lightSwitch.turnedOn
                            ? 'bg-neutral-600 text-white shadow-md font-black'
                            : 'bg-neutral-700 text-neutral-500'
                        }`}
                      >
                        OFF
                      </div>
                    </button>
                    <span className="text-[10px] text-neutral-400 mt-1 font-mono">ROCKER SWITCH</span>
                  </div>

                  {/* Ceiling Chandelier Preview */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div
                      className={`p-3 rounded-lg border transition-all ${
                        appliances.lightSwitch.turnedOn
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-500'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles
                          className={`w-4 h-4 ${
                            appliances.lightSwitch.turnedOn ? 'text-amber-400 animate-spin' : 'text-neutral-600'
                          }`}
                        />
                        <span className="text-xs font-semibold text-white">
                          {appliances.lightSwitch.turnedOn
                            ? 'Ceiling Chandelier Lit'
                            : 'Ceiling Lights Off'}
                        </span>
                      </div>
                      <p className="text-[11px]">
                        {appliances.lightSwitch.turnedOn
                          ? 'Warm LED lighting dispels storm shadows and keeps indoor visibility bright.'
                          : 'Rooms are dim. Flip switch to turn on warm golden illumination.'}
                      </p>
                    </div>

                    {/* Dimmer Slider */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                        <span>Dimmer Intensity</span>
                        <span>{appliances.lightSwitch.brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={appliances.lightSwitch.brightness}
                        onChange={e => handleBrightnessChange(Number(e.target.value))}
                        disabled={!appliances.lightSwitch.turnedOn}
                        className="w-full accent-amber-400 cursor-pointer disabled:opacity-40"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-neutral-400">
                Connected to rooftop solar battery relay. Does not consume island grid fuel.
              </div>
            </div>

            {/* 4. CEILING FAN & AC */}
            <div className="p-4 rounded-xl bg-neutral-800/80 border border-neutral-700/80 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Fan className="w-5 h-5 text-teal-400" />
                    <h3 className="font-semibold text-sm text-white">Ceiling Fan & Air Cooler</h3>
                  </div>
                  <button
                    onClick={handleToggleFan}
                    className={`px-2 py-0.5 text-xs font-bold rounded flex items-center gap-1 transition-colors ${
                      appliances.fan.turnedOn
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{appliances.fan.turnedOn ? 'ON' : 'OFF'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-neutral-900 border border-neutral-700/80">
                  {/* Animated Fan icon */}
                  <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                    <Fan
                      className={`w-12 h-12 transition-transform text-teal-400 ${
                        appliances.fan.turnedOn ? 'animate-spin' : 'opacity-40'
                      }`}
                      style={{
                        animationDuration:
                          appliances.fan.speed === 3
                            ? '0.35s'
                            : appliances.fan.speed === 2
                            ? '0.7s'
                            : '1.2s',
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    <span className="text-xs font-semibold text-white">Cooling Airflow</span>
                    <p className="text-[11px] text-neutral-400 mb-2">
                      {appliances.fan.turnedOn
                        ? `Circulating fresh breeze at Speed ${appliances.fan.speed}. Restores stamina!`
                        : 'Fan is stopped. Turn on for comfortable indoor climate.'}
                    </p>

                    <div className="flex gap-1.5">
                      {[1, 2, 3].map(spd => (
                        <button
                          key={spd}
                          onClick={() => handleSetFanSpeed(spd)}
                          className={`flex-1 py-1 text-xs font-bold rounded transition-colors ${
                            appliances.fan.turnedOn && appliances.fan.speed === spd
                              ? 'bg-teal-500 text-neutral-950 font-black'
                              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                          }`}
                        >
                          Speed {spd}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400">
                <span>Status: {appliances.fan.turnedOn ? 'Active cooling' : 'Idle'}</span>
                <span className="text-teal-300 font-medium">Breeze cooling active</span>
              </div>
            </div>

            {/* 5. MICROWAVE & INDUCTION STOVE */}
            <div className="p-4 rounded-xl bg-neutral-800/80 border border-neutral-700/80 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <h3 className="font-semibold text-sm text-white">Microwave & Induction Stove</h3>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-mono rounded bg-orange-500/15 text-orange-300 border border-orange-500/30">
                    Kitchen Unit
                  </span>
                </div>

                <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-700/80 flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-16 h-12 rounded-lg bg-neutral-800 border-2 border-neutral-600 flex items-center justify-center text-xl">
                    {appliances.microwave.isCooking ? '♨️' : '🍲'}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white mb-0.5">
                      {appliances.microwave.isCooking
                        ? 'Heating Dinner...'
                        : 'Cook Hot Nutritious Meal'}
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Cooks emergency rations into piping hot stew: +40% Hunger, +20% Health, +15% Energy!
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <button
                  onClick={handleCookMicrowaveMeal}
                  disabled={appliances.microwave.isCooking}
                  className="w-full py-2 text-xs font-semibold rounded-lg bg-orange-600 hover:bg-orange-500 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>
                    {appliances.microwave.isCooking
                      ? `Cooking in progress (${appliances.microwave.timeLeftSeconds}s)...`
                      : 'Cook Fresh Meal (+40 Hunger, +20 Health)'}
                  </span>
                </button>
              </div>
            </div>

            {/* 6. COMFY LIVING ROOM SOFA & REST */}
            <div className="p-4 rounded-xl bg-neutral-800/80 border border-neutral-700/80 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-5 h-5 text-rose-400" />
                    <h3 className="font-semibold text-sm text-white">Cushioned Lounge Sofa</h3>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-mono rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                    Rest Zone
                  </span>
                </div>

                <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-700/80 flex items-center gap-3">
                  <div className="text-3xl">🛋️</div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white mb-0.5">Energy Recovery Sanctuary</div>
                    <p className="text-[11px] text-neutral-400">
                      Take a deep breath and rest during calm weather or inside the reinforced shelter to recover full stamina.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <button
                  onClick={handleRestOnSofa}
                  className="w-full py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors flex items-center justify-center gap-2"
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Rest on Sofa (Recover 100% Energy)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-neutral-950/80 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-2">
          <div className="flex items-center gap-2">
            <span>💡 Quick tip: Walk near appliances inside the house or press [B] anytime.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
          >
            Back to Island Map
          </button>
        </div>
      </div>
    </div>
  );
};
