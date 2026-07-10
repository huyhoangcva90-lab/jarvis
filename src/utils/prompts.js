export const promptCards = [
  {
    title: "Plan My Day",
    prompt: "Act as my personal mission planner. Use my current context to create a focused day plan with priorities, time blocks, risks, and a realistic first action."
  },
  {
    title: "Debug Problem",
    prompt: "Help me debug a problem. Ask clarifying questions only if needed, isolate the likely causes, propose tests, and give me a step-by-step repair path."
  },
  {
    title: "Recover Mood",
    prompt: "I need a mood reset. Help me name what is happening, reduce pressure, choose one small stabilizing action, and return to useful momentum."
  },
  {
    title: "Make Content",
    prompt: "Turn my idea into content. Give me angles, a strong outline, opening hooks, a clear structure, and a simple publishing checklist."
  },
  {
    title: "Learn Something",
    prompt: "Teach me this topic like a patient expert. Start with the mental model, then examples, mistakes to avoid, and a short practice task."
  },
  {
    title: "Review My Day",
    prompt: "Review my day with me. Help me extract wins, unfinished loops, lessons, emotional signals, and the best next action for tomorrow."
  }
];

export function buildTodayContext(data) {
  const sideQuests = data.sideQuests.filter(Boolean).join("; ") || "No side quests set";
  return [
    `Operator: ${data.username}`,
    `AI persona: ${data.aiPersonaName}`,
    `Mood: ${data.mood}`,
    `Energy: ${data.energy}`,
    `Main mission: ${data.mainQuest}`,
    `Side quests: ${sideQuests}`,
    `Mission status: ${data.missionStatus}`,
    `Active project: ${data.activeProject}`,
    "",
    "Use this as my current context. Help me choose the next useful action."
  ].join("\n");
}

export function buildFullContext(data) {
  return [
    buildTodayContext(data),
    "",
    "Memory:",
    `Who I am: ${data.memory.whoIAm}`,
    `Current projects: ${data.memory.currentProjects}`,
    `Long-term goals: ${data.memory.longTermGoals}`,
    `AI response rules: ${data.memory.aiRules}`,
    `Things to remember: ${data.memory.remember}`
  ].join("\n");
}
