import { DecisionScenario } from '../types/game';

export const DECISION_SCENARIOS: DecisionScenario[] = [
  // Stage 1: Storm Warning
  {
    id: 'decision_stage_1',
    stageNumber: 1,
    stageName: 'Stage 1: Storm Warning',
    stormLevel: 1,
    title: 'Bay of Bengal Cyclonic Depression Detected',
    situation:
      'Coastal radar in Tamil Nadu has detected a deep cyclonic depression moving at 75 km/h across the Bay of Bengal. Wind gusts will hit coastal homes within minutes. Base Command must commit the initial defense protocol.',
    contextAlert: 'Storm Level 1 Advisory: Gale front 80 km away. Power reserves: 90%. Time to impact: 10:00.',
    choices: [
      {
        id: 'choice_1_sensors',
        title: 'Calibrate Meteorological Radar & Early Shield Arrays',
        description: 'Deploy Doppler radar sweeps and lock exterior window louvers early to protect home structure.',
        resourceImpacts: {
          power: -8,
          health: 0,
          oxygen: 0,
          water: 0,
          time: -30,
        },
        consequenceText:
          'Radar telemetry successfully maps storm vortices! Early louver locking prevents window damage. -8% Power consumed for radar sweeps, but trajectory precision grants tactical foresight.',
        hint: 'Early detection consumes slight power but prevents sudden surprises as the storm scales to Level 2.',
        followUpObjective: 'Verify base perimeter seals and prep power relays.',
        successScore: 9,
      },
      {
        id: 'choice_1_hunker',
        title: 'Immediate Total Home Lockdown & Cut Non-Essential Circuits',
        description: 'Halt exterior work immediately, dim interior lighting, and isolate non-critical systems.',
        resourceImpacts: {
          power: +5,
          health: 0,
          oxygen: -5,
          water: 0,
          time: -15,
        },
        consequenceText:
          'Power conserved by +5%, but shutting down ventilation pumps early causes a minor dip in fresh air distribution (-5% O2). Team reports stuffy conditions.',
        hint: 'Conserving energy is vital, but shutting down ventilation too early reduces airflow.',
        followUpObjective: 'Rebalance auxiliary ventilation scrubbers.',
        successScore: 7,
      },
      {
        id: 'choice_1_delay',
        title: 'Delay Lockdown: Expedite Exterior Material Gathering',
        description: 'Attempt to harvest 3 more timber and stone piles outside before sealing the heavy doors.',
        resourceImpacts: {
          power: -12,
          health: -15,
          oxygen: -10,
          water: -5,
          time: -90,
        },
        consequenceText:
          'High risk! Sudden gust blasts the outer entryway. Rain and debris infiltrate (-15% Health from impact, -10% Oxygen). Some wood is secured, but storm prep is severely delayed.',
        hint: 'Prioritizing material gathering when a Level 1 storm is rapidly escalating puts safety at severe risk.',
        followUpObjective: 'Clean entry filters and treat minor injuries.',
        successScore: 4,
      },
    ],
  },

  // Stage 2: Protect the Base
  {
    id: 'decision_stage_2',
    stageNumber: 2,
    stageName: 'Stage 2: Protect the Base',
    stormLevel: 2,
    title: 'Structural Vulnerability in Shelter Frame',
    situation:
      'Gale-force winds have reached 110 km/h (Storm Level 2). Exterior pressure differentials are stressing the shelter roof tiles and the communication tower cables.',
    contextAlert: 'Storm Level 2 Warning: Roof truss vibration detected. Exterior wind pressure rising.',
    choices: [
      {
        id: 'choice_2_hydroponics',
        title: 'Reinforce Shelter Roof & Timber Trusses',
        description: 'Divert hydraulic clamps and ropes to secure roof rafters and preserve water cisterns.',
        resourceImpacts: {
          health: 0,
          power: -10,
          oxygen: +8,
          water: +5,
          time: -45,
        },
        consequenceText:
          'Roof protected! Rain cisterns maintain stability (+5% Water, +8% Oxygen sustained). However, communication array stays unreinforced and begins swaying in the gale.',
        hint: 'The roof shelters our living space and water supply. Protecting it ensures structural survival.',
        followUpObjective: 'Monitor antenna alignment via manual gyro-trim.',
        successScore: 9,
      },
      {
        id: 'choice_2_antenna',
        title: 'Secure Communications Array & Weather Satellite Dish',
        description: 'Brace the primary dish mast to maintain emergency contact with disaster management authorities.',
        resourceImpacts: {
          health: -5,
          power: -12,
          oxygen: -6,
          water: -8,
          time: -40,
        },
        consequenceText:
          'Communications dish anchored! IMD radar telemetry remains crisp. However, shelter tiles shifted allowing minor rain leak (-8% Water, -6% Oxygen).',
        hint: 'Communications are vital for emergency updates, but ignoring the roof risks water and shelter integrity.',
        followUpObjective: 'Patch moisture leak in secondary ceiling joints.',
        successScore: 7,
      },
      {
        id: 'choice_2_automated_overload',
        title: 'Force Overclock on Drainage Water Pumps',
        description: 'Pump high voltage into floodwater sumps to prevent courtyard inundation.',
        resourceImpacts: {
          health: -10,
          power: -25,
          oxygen: 0,
          water: 0,
          time: -20,
        },
        consequenceText:
          'A circuit breaker trips under the sudden electrical load! A bright arc flash in the utility room causes minor injury (-10% Health). Base power drains by -25%.',
        hint: 'Sudden electrical surges on strained systems can trip main breakers and cause hazardous short circuits.',
        followUpObjective: 'Replace burned out magnetic bus fuses in Power Core.',
        successScore: 5,
      },
    ],
  },

  // Stage 3: Save the Power
  {
    id: 'decision_stage_3',
    stageNumber: 3,
    stageName: 'Stage 3: Save the Power',
    stormLevel: 3,
    title: 'Severe Grid Overload & Battery Depletion',
    situation:
      'Storm Level 3 is raging. Heavy rainfall and cloud cover have dropped solar input to near zero. Coastal winds are testing backup battery relays.',
    contextAlert: 'Storm Level 3 Critical: Solar input < 5%. Grid drain: 8.5 kW/min. Batteries below 45%.',
    choices: [
      {
        id: 'choice_3_piezo_scrub',
        title: 'Activate Rooftop Solar Inverter & Battery Bank',
        description: 'Switch essential circuits to deep-cycle lithium storage and auxiliary battery banks.',
        resourceImpacts: {
          power: +18,
          health: 0,
          oxygen: -4,
          water: 0,
          time: -35,
        },
        consequenceText:
          'Ingenious solution! The smart inverter stabilizes voltage and back-feeds essential loads, boosting net power reserves by +18%!',
        hint: 'Smart battery bank management restores stable voltage during storm blackouts.',
        followUpObjective: 'Calibrate battery charging controller to steady frequency.',
        successScore: 9,
      },
      {
        id: 'choice_3_subsystem_triage',
        title: 'Triage Base Grid: Power Down Outer Quarters',
        description: 'Divert all remaining electricity exclusively to Oxygen Life Support and Medical Stations.',
        resourceImpacts: {
          power: +10,
          health: -8,
          oxygen: +12,
          water: -5,
          time: -25,
        },
        consequenceText:
          'Life support stabilized (+12% O2)! Outer rooms turn cold and dark (-8% Health from harsh conditions). The team gathers in the warm central room.',
        hint: 'Sacrificing non-essential heating protects vital air systems, but crew comfort degrades.',
        followUpObjective: 'Distribute thermal blankets to crew members.',
        successScore: 8,
      },
      {
        id: 'choice_3_push_turbines',
        title: 'Over-spin Wind Generators in 140 km/h Gusts',
        description: 'Disengage mechanical turbine governor brakes to harvest maximum power from violent winds.',
        resourceImpacts: {
          power: -20,
          health: -15,
          oxygen: -5,
          water: 0,
          time: -50,
        },
        consequenceText:
          'Catastrophic failure! Turbine bearings overheat and shatter under 140 km/h gusts. Flying debris damages the exterior wall (-15% Health). Power grid loses -20% from shorting.',
        hint: 'Wind turbines have strict velocity cut-offs; running them in extreme gusts causes severe mechanical damage.',
        followUpObjective: 'Isolate shredded turbine cables before they arc to the main transformer.',
        successScore: 3,
      },
    ],
  },

  // Stage 4: Rescue the Rover
  {
    id: 'decision_stage_4',
    stageNumber: 4,
    stageName: 'Stage 4: Rescue the Rover',
    stormLevel: 4,
    title: 'The Triple Dilemma: Rescue Vehicle, Oxygen, or Communications',
    situation:
      'Storm Level 4 has hit with 165 km/h winds! The coastal rescue vehicle is stranded outside near the embankment with vital medical supplies. Simultaneously, shelter air scrubbers are vibrating violently, and coastal radio comms are failing.',
    contextAlert:
      'STORM LEVEL 4 EMERGENCY: Power at 30%, Health at 60%. Three critical systems demand immediate intervention!',
    choices: [
      {
        id: 'choice_4_rover',
        title: 'Option A: Save the Coastal Rescue Vehicle',
        description: 'Deploy steel cable winch and guide the vehicle safely into the garage before gale winds overturn it.',
        resourceImpacts: {
          power: -12,
          health: -5,
          oxygen: -10,
          water: 0,
          time: -40,
        },
        consequenceText:
          'VEHICLE SECURED! The winch pulls the rescue vehicle safely into the garage. Its high-capacity mobile battery and first-aid supplies are saved and can power shelter systems! However, air scrubbers suffered a drop (-10% O2).',
        hint: 'Saving the vehicle preserves mobile transport and power, though air filtration must be serviced immediately after.',
        followUpObjective: 'Connect rescue vehicle battery directly to shelter power bus.',
        successScore: 8,
      },
      {
        id: 'choice_4_oxygen',
        title: 'Option B: Protect the Oxygen & Air Filtration System',
        description: 'Focus all engineering resources on welding and sealing the vibrating air filtration manifold.',
        resourceImpacts: {
          power: -8,
          health: +5,
          oxygen: +25,
          water: +5,
          time: -35,
        },
        consequenceText:
          'AIR FILTRATION SAVED! The manifold is securely welded and pressurized. Breathable air rises to optimal levels (+25% Oxygen). The vehicle outside suffers minor paint scraping, but the shelter breathes easy.',
        hint: 'Breathable clean air is fundamental. Protecting air filtration provides an essential survival buffer.',
        followUpObjective: 'Run vehicle diagnostic to lock parking brakes remotely.',
        successScore: 9,
      },
      {
        id: 'choice_4_comms',
        title: 'Option C: Repair Emergency Communications Relay',
        description: 'Realign high-gain antenna mast to maintain continuous live feed with disaster management control.',
        resourceImpacts: {
          power: -15,
          health: 0,
          oxygen: -12,
          water: -5,
          time: -30,
        },
        consequenceText:
          'COMMUNICATIONS RESTORED! Disaster management satellite uplinks exact radar predictions of cyclone eye passage! However, power dropped (-15%) and oxygen dropped (-12%) while the team worked on antenna lines.',
        hint: 'Live satellite weather data reveals exact storm track, enabling precision planning.',
        followUpObjective: 'Download satellite atmospheric trajectory model.',
        successScore: 7,
      },
    ],
  },

  // Stage 5: Emergency Commander
  {
    id: 'decision_stage_5',
    stageNumber: 5,
    stageName: 'Stage 5: Emergency Commander',
    stormLevel: 5,
    title: 'Severe Cyclone Landfall: Teamwork Defense',
    situation:
      'The storm has escalated to Storm Level 5: Super Cyclone Landfall! 220 km/h winds, torrential rain, near zero visibility. All team members await your command: Dr. Priya Sharma, Eng. Marcus Chen, Specialist Kaviya, and Dr. Liam Vance.',
    contextAlert:
      'STORM LEVEL 5 CATACLYSM: Cyclone eyewall making landfall. Structural strain at maximum limit.',
    choices: [
      {
        id: 'choice_5_delegate_specialties',
        title: 'Synchronized Crew Specialization Protocol',
        description: 'Assign Priya to Life Support, Marcus to Electrical Grid, Kaviya to Rescue Vehicle link, and Liam to barometer tracking.',
        resourceImpacts: {
          health: +10,
          power: +15,
          oxygen: +15,
          water: +10,
          time: -40,
        },
        consequenceText:
          'OUTSTANDING LEADERSHIP! Every specialist executes their exact emergency training. Marcus stabilizes the power grid, Priya ensures clean air, Kaviya links vehicle batteries, and Liam warns of gust surges before they hit! The entire home shelter survives the storm peak!',
        hint: 'True Emergency Commanders trust their crew and delegate tasks according to individual expertise.',
        followUpObjective: 'Hold shelter integrity until cyclone eye passes.',
        successScore: 10,
      },
      {
        id: 'choice_5_centralize_command',
        title: 'Centralize All Crew Inside Reinforced Home Sanctuary',
        description: 'Abandon peripheral verandas, secure heavy storm shutters, and gather all 4 teammates in the central reinforced core.',
        resourceImpacts: {
          power: -15,
          health: +15,
          oxygen: -5,
          water: -10,
          time: -20,
        },
        consequenceText:
          'CREW SAFETY SECURED! With everyone in the central sanctuary, zero human injuries occur (+15% Health). However, peripheral wiring in outer corridors shorts out without hands to manage it (-15% Power).',
        hint: 'Grouping everyone in the sanctuary minimizes physical danger, but exterior equipment suffers damage.',
        followUpObjective: 'Reboot remote monitoring from sanctuary terminal.',
        successScore: 8,
      },
      {
        id: 'choice_5_exterior_sortie',
        title: 'Emergency Sortie: Send Crew Outside with Ropes in 220 km/h Winds',
        description: 'Send two responders outside into 220 km/h winds to manually tie down courtyard sheds.',
        resourceImpacts: {
          health: -30,
          power: -5,
          oxygen: -15,
          water: 0,
          time: -60,
        },
        consequenceText:
          'DISASTROUS COMMAND DECISION! Hurricane-speed winds violently blow debris! A crew member is injured by flying tin sheet (-30% Health). Dr. Priya barely drags them back inside. Shed was partially tied, but the human cost is grave.',
        hint: 'Never send people outside into a Level 5 super cyclone. Interior shelter must always be prioritized.',
        followUpObjective: 'Administer emergency Medical Kit and treat injuries.',
        successScore: 2,
      },
    ],
  },
];
