export const motivationalMessages = [
  "Good luck,",
  "You’ve got this,",
  "Go make it happen,",
  "Time to shine,",
  "This is your moment,",
  "Stay focused and unstoppable,",
  "Push your limits today,",
  "Believe and achieve,",
  "Own your journey,",
  "Give it your all,",
  "Keep pushing forward,",
  "Let your hard work speak,",
  "Stay strong and keep moving,",
  "You’re built for greatness,",
  "Go conquer your goals,",
  "Trust yourself, you can do it,",
  "Make today count,",
  "Stay motivated and keep going,",
  "Be bold, be brave,",
  "Rise and shine,",
]

export function getRandomMotivationalMessage(name: string): string {
  const randomIndex = Math.floor(Math.random() * motivationalMessages.length)
  return `${motivationalMessages[randomIndex]} ${name}!`
}
