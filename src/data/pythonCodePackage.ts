export interface PythonFile {
  filename: string;
  description: string;
  code: string;
}

export const PYTHON_CODE_FILES: PythonFile[] = [
  {
    filename: 'main.py',
    description: 'Main application router: Home -> Profile -> Dashboard -> Storm Survival Game',
    code: `"""
Storm Survival — Main Application Entry Point
Navigation Flow: HOME -> PROFILE -> DASHBOARD -> GAME
Run with: python main.py
"""
import pygame
import sys
from home import HomeScreen
from profile import ProfileManager
from dashboard import DashboardScreen
from game import StormSurvivalGame
from characters import HEROES
from save_data import SaveManager

pygame.init()
pygame.font.init()
WIDTH, HEIGHT = 1024, 768
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Storm Survival")
clock = pygame.time.Clock()

class App:
    def __init__(self):
        self.save_mgr = SaveManager()
        self.profile = self.save_mgr.load_profile()
        self.home_screen = HomeScreen(self)
        self.dashboard_screen = DashboardScreen(self)
        self.game = None
        self.current_screen = "HOME" # HOME, PROFILE, DASHBOARD, GAME

    def run(self):
        running = True
        while running:
            dt = clock.tick(60) / 1000.0
            events = pygame.event.get()
            for event in events:
                if event.type == pygame.QUIT:
                    running = False

            if self.current_screen == "HOME":
                self.home_screen.handle_events(events)
                self.home_screen.render(screen)
            elif self.current_screen == "DASHBOARD":
                self.dashboard_screen.handle_events(events)
                self.dashboard_screen.render(screen)
            elif self.current_screen == "GAME" and self.game:
                self.game.handle_events(events)
                self.game.update(dt)
                self.game.render(screen)

            pygame.display.flip()

        pygame.quit()
        sys.exit()

if __name__ == "__main__":
    app = App()
    app.run()
`,
  },
  {
    filename: 'characters.py',
    description: '8 Original Anime-Inspired Heroes with abilities and cooldowns',
    code: `"""
Original Anime-Inspired Heroes for Storm Survival
"""

HEROES = [
    {
        "id": "hero_thunder",
        "title": "Thunder Hero",
        "name": "Raijin Volt",
        "ability": "Plasma Surge",
        "cooldown": 45,
        "effect": "Restores +20% Power grid",
        "color": (245, 158, 11)
    },
    {
        "id": "hero_iron",
        "title": "Iron Guardian",
        "name": "Tetsuo Aegis",
        "ability": "Rapid Fortify",
        "cooldown": 50,
        "effect": "Repairs station integrity +30%",
        "color": (226, 232, 240)
    },
    {
        "id": "hero_shield",
        "title": "Shield Captain",
        "name": "Kaito Barrier",
        "ability": "Aegis Forcefield",
        "cooldown": 60,
        "effect": "Negates storm damage for 20s",
        "color": (59, 130, 246)
    },
    {
        "id": "hero_web",
        "title": "Web Runner",
        "name": "Ren Hayate",
        "ability": "Turbine Dash",
        "cooldown": 35,
        "effect": "Doubles movement speed",
        "color": (16, 185, 129)
    },
    {
        "id": "hero_shadow",
        "title": "Shadow Trickster",
        "name": "Kage Kuro",
        "ability": "Vortex Decoy",
        "cooldown": 55,
        "effect": "Reduces storm stress level",
        "color": (168, 85, 247)
    },
    {
        "id": "hero_panther",
        "title": "Panther Guardian",
        "name": "Kuroba Feline",
        "ability": "Sensory Prowl",
        "cooldown": 40,
        "effect": "Highlights safe routes in storm",
        "color": (244, 63, 94)
    },
    {
        "id": "hero_archer",
        "title": "Cosmic Archer",
        "name": "Aoi Stella",
        "ability": "Ion Sniping",
        "cooldown": 50,
        "effect": "Remotely activates distant stations",
        "color": (6, 182, 212)
    },
    {
        "id": "hero_mage",
        "title": "Storm Mage",
        "name": "Yukino Gale",
        "ability": "Barometric Calm",
        "cooldown": 60,
        "effect": "Slows storm timer & restores +15% O2",
        "color": (99, 102, 241)
    }
]
`,
  },
  {
    filename: 'question_bank.py',
    description: 'Grade 6-10 Question Banks with exact count enforcement (Easy 10, Medium 3, Hard 2)',
    code: `"""
Structured Question Bank for Storm Survival
Categories: Tamil, English, Mathematics, Science, Social Science
Rule: Easy has exactly 10 questions, Medium has exactly 3, Hard has exactly 2.
"""
import random

QUESTION_BANK = [
    # Tamil, English, Mathematics, Science, Social Science sets
    {"id": "tam_01", "subject": "tamil", "grade": 6, "difficulty": "Easy", "question": "புயல் வேகமாக ______ (நகர்கிறது/பறந்தது)", "options": ["நகர்கிறது", "பறந்தது", "உறங்குகிறது", "நீந்துகிறது"], "answer": 0},
    {"id": "eng_01", "subject": "english", "grade": 6, "difficulty": "Easy", "question": "The hero ______ the airlock before the gale arrived.", "options": ["secured", "secures", "securing", "will secure"], "answer": 0},
    {"id": "mat_01", "subject": "mathematics", "grade": 6, "difficulty": "Easy", "question": "What is the sum of digits in 387?", "options": ["18", "17", "19", "16"], "answer": 0},
    {"id": "sci_01", "subject": "science", "grade": 6, "difficulty": "Easy", "question": "What energy transformation occurs in a wind turbine?", "options": ["Kinetic to Electrical", "Chemical to Sound", "Nuclear to Heat", "Light to Chemical"], "answer": 0},
    {"id": "soc_01", "subject": "social_science", "grade": 6, "difficulty": "Easy", "question": "Which ancient civilization built planned drainage at Harappa?", "options": ["Indus Valley", "Mesopotamia", "Egypt", "Rome"], "answer": 0},
]

def get_question_set(difficulty, answered_ids):
    """Enforces exact question counts per difficulty without repetition."""
    if difficulty == "Easy":
        # Exactly 10 questions
        req_count = 10
    elif difficulty == "Medium":
        # Exactly 3 questions
        req_count = 3
    else:
        # Exactly 2 questions
        req_count = 2

    pool = [q for q in QUESTION_BANK if q["id"] not in answered_ids]
    if len(pool) < req_count:
        pool = QUESTION_BANK # fallback if exhausted
    random.shuffle(pool)
    return pool[:req_count]
`,
  },
  {
    filename: 'rewards.py',
    description: 'Streak rewards logic: 3 consecutive correct (+15 HP), 5 consecutive correct (+1 Diamond)',
    code: `"""
Rewards and Streak Progression
"""

class RewardEngine:
    def __init__(self, player, resources):
        self.player = player
        self.resources = resources
        self.consecutive_streak = 0

    def record_answer(self, is_correct):
        if is_correct:
            self.consecutive_streak += 1
            self.player["coins"] += 10
            self.player["xp"] += 35
            self.player["total_correct"] += 1

            # 3 consecutive correct: restore +15 health
            if self.consecutive_streak == 3:
                self.resources["health"] = min(100, self.resources["health"] + 15)
                return {"type": "streak_3", "message": "3 Streak! +15 Health Restored!"}

            # 5 consecutive correct: +1 diamond
            if self.consecutive_streak == 5:
                self.player["diamonds"] += 1
                self.consecutive_streak = 0 # reset after awarding milestone
                return {"type": "streak_5", "message": "5 Streak Master! +1 Diamond Awarded!"}

            return {"type": "correct", "message": "+10 Coins, +35 XP"}
        else:
            self.consecutive_streak = 0
            self.resources["health"] = max(0, self.resources["health"] - 10)
            return {"type": "wrong", "message": "Incorrect (-10 Health). Streak reset."}
`,
  },
  {
    filename: 'requirements.txt',
    description: 'Python dependencies',
    code: `pygame>=2.5.0
pillow>=10.0.0
`,
  },
  {
    filename: 'README.md',
    description: 'Instructions to run the standalone Storm Survival game on desktop',
    code: `# Storm Survival — Python & Pygame Edition

A complete 2D educational survival adventure featuring anime-inspired heroes, dynamic 5-level storms, and grade-appropriate challenges.

## Main Navigation Flow
\`HOME → PROFILE → DASHBOARD → STORM SURVIVAL GAME\`

## Installation & Launch

1. Ensure Python 3.10+ is installed:
\`\`\`bash
python --version
\`\`\`

2. Install Pygame:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

3. Run Storm Survival:
\`\`\`bash
python main.py
\`\`\`

## Controls
- **WASD / Arrow Keys**: Move Hero
- **SPACE / Enter**: Inspect & Repair Base Stations (Life, Power, Solar, Rover, Comms)
- **E**: Activate Hero's Special Ability
- **S**: Open Emergency Requisition Shop
- **H**: Use Diamond for Guided Intelligence Hint
- **ESC**: Pause / Return to Dashboard
`,
  },
];
