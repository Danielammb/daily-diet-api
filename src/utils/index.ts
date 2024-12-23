type Meal = {
  id: string;
  name: string;
  description: string;
  date: string;
  isInDiet: boolean;
  user_id: string;
};

export function getBestSequenceChronological(meals: Meal[]) {
  let bestSequence = 0;
  let currentSequence = 0;
  let lastDate: string | null = null;

  meals
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .forEach((meal) => {
      if (meal.isInDiet) {
        if (
          lastDate &&
          new Date(meal.date).getTime() - new Date(lastDate).getTime() ===
            86400000
        ) {
          currentSequence++;
        } else {
          currentSequence = 1;
        }
        bestSequence = Math.max(bestSequence, currentSequence);
      } else {
        currentSequence = 0;
      }
      lastDate = meal.date;
    });

  return bestSequence;
}
