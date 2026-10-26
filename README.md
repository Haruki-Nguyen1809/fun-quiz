# React Quiz App

A small interactive quiz built with React. Players choose a topic, a difficulty level and the number of questions, answer multiple-choice questions, earn points, and see their result and best score at the end.

This is a practice project for learning React: components, props, state, derived values and lifting state up.

## Features

- Settings screen with three choices: topic, difficulty level and number of questions.
- An "All" option for topic and level to merge groups of questions (for example, all topics at easy level).
- The list of selectable question counts adapts to how many questions match the chosen topic and level.
- Quiz screen with one question at a time, four answer choices, a running score and a progress line.
- Instant feedback: the correct answer turns green, a wrong choice turns red.
- Result screen with the final score and the number of correct answers.
- The Restart button returns to the settings screen, with the previous choices still selected.
- The highest score is remembered while the page stays open.

## Project structure

- `data.js`: the question bank (an array of question objects).
- `SelectionScreen.jsx`: the parent component. Holds the settings, filters the questions, tracks the highest score and decides which screen to show.
- `Quiz.jsx`: the quiz itself. Holds the current question, the score and the finished flag.
- `AnswerDiv.jsx`: one clickable answer, styled by its status.
- `NextBtn`, `StartBtn`, `RestartBtn`: small reusable button components that receive their behaviour through props.

Component relationship:

```
main
 └── SelectionScreen   (settings state, highest score, screen switch)
        ├── settings screen   (three selects, Start button)
        └── Quiz              (score, current question, finished flag)
               ├── AnswerDiv  (one per answer)
               ├── NextBtn
               └── RestartBtn
```

## Getting started

Requirements: Node.js and npm.

```
npm install
npm run dev
```

Then open the local address printed in the terminal. (The exact commands depend on the bundler used by the project; the above assumes a Vite setup.)

## Core logic, algorithms and data structures

### 1. Question bank: an array of objects

Each question is one object in an array:

```
question = {
    id,
    topic,                      // "animal" or "food"
    level,                      // "easy", "medium" or "hard"
    question,                   // the text shown to the player
    options: [ { answer, correct }, ... ]   // correct is true or false
}
```

Why this shape: one flat array is easy to filter, and keeping the correct flag inside each option means checking an answer needs no separate answer key. The bank holds 36 questions (2 topics x 3 levels x 6 questions).

### 2. Filtering with an "all" wildcard

A question is kept only when it passes two gates, and each gate is a wildcard check:

```
keep question if:
    (selected topic is "all"  OR  question.topic equals selected topic)
    AND
    (selected level is "all"  OR  question.level equals selected level)
```

"All" never appears in the data. It exists only as a user choice, so it needs its own check on the state side. The pass over the array is O(n) with n = number of questions.

Example counts with this data: animal + easy gives 6, all + easy gives 12, all + all gives 36.

### 3. Derived values instead of extra state

Only the user's choices are stored in state. Everything else is computed on every render:

```
filtered      = questions that pass the two gates
maxQuestion   = min(filtered.length, 10)          // 10 is a fixed cap
usedQuestion  = min(chosen number, maxQuestion)   // the number actually used
playList      = first usedQuestion items of filtered
```

Benefits: nothing can drift out of sync, and there are no extra effects or update functions to maintain.

### 4. Clamping a user choice to a changing limit

The chosen number of questions can become larger than what the new filter allows (for example 10 chosen at all + all, then the level changes to a group with only 6 questions). Instead of overwriting the state, the app keeps the user's wish in state and uses `min(wish, limit)` everywhere it is read (select value, slicing, display):

```
usedQuestion = min(numberOfQuestions, maxQuestion)
```

Switching back restores the original wish automatically, because the state was never overwritten. This pattern is called clamping.

### 5. Generating the selectable counts

The options of the "number of questions" select are generated, not hard-coded:

```
list = empty
for i from 5 up to maxQuestion (inclusive):
    add i to list
render one option per number in list (key = value = the number)
```

The `<=` bound matters: with `<` the last number would be missing.

### 6. Scoring rules

```
on answer click:
    if an answer was already chosen for this question: ignore   (one scored click per question)
    otherwise remember the choice and score it:
        correct: score + 1 and correct-count + 1
        wrong:   score - 1, but never below 0
```

The score and the count of correct answers are tracked separately, so the result screen can show both. A guard blocks the Next button until an answer is chosen.

### 7. Answer status mapping (tri-state)

For each option after an answer is chosen:

```
if nothing chosen yet:            status = null     (neutral)
else if option is correct:        status = true     (always revealed in green)
else if option is the chosen one: status = false    (shown in red)
else:                             status = null
```

`AnswerDiv` maps the status to a CSS class: true to "correct", false to "incorrect", null to "notClick".

### 8. Quiz flow as a small state machine

State: `currentQuestion` (index), `chooseAnswer`, `isFinished`.

```
on Next/Finish click:
    if no answer chosen: stop
    if there are more questions: go to the next index and clear the chosen answer
    else: set isFinished = true and report the score to the parent
```

The button label is "Finish" on the last question and "Next" otherwise. When `isFinished` is true the component returns the result screen instead of the question screen.

### 9. Lifting state up and function props

Data goes from parent to child through props. For the child to change something in the parent, the parent passes a function down and the child calls it, passing a value:

```
SelectionScreen passes down:
    quizArray   (the play list)
    onReset     (go back to the settings screen)
    saveScore   (receive the final score)

Quiz calls:
    saveScore(currentScore)  when the quiz ends
    onReset()                when Restart is clicked
```

The function itself still runs inside the parent, so it can change the parent's state.

### 10. Best score with Math.max

```
on saveScore(point):
    highestScore = max(point, highestScore)
```

No `if` is needed. Because `SelectionScreen` is always rendered, its state (settings and highest score) survives, while `Quiz` is unmounted when the settings screen is shown, so its own state (score, current question, finished flag) resets automatically on the next start. This is why no manual reset function is needed.

## Possible improvements

- Shuffle the questions (for example with a Fisher-Yates shuffle) so every game differs.
- Keep the highest score in `localStorage` so it survives a page reload.
- Track the highest score per settings combination.
- Add a countdown timer per question.
- Handle the case where fewer than 5 questions match the filters.
- Add more topics and questions.

## Lessons learned

- **A state value can be an array index.** `currentQuestion` is a single number in state, and the current question is read from the array with it. The index starts at 0, so it is shown as index + 1, and the last question is at length - 1.
- **A component can have more than one `return`.** I first thought a component could only return one thing. An `if` can return one of two screens (settings or quiz, question or result), and only one `return` runs per render. All `useState` calls stay above every `if`.
- **`Math.min` and `Math.max` find a value and set a limit.** `Math.min` caps a value at a maximum (number of questions), `Math.max` keeps the largest value (highest score). Combined, they clamp a value into a range.
- **A child changes the parent by calling a function the parent passed down.** Data flows down through props, and the function still runs in the parent, so it can update the parent's state.
- **State lives as long as its component is rendered.** `Quiz` is removed when the settings screen is shown, so its state resets on the next start. `SelectionScreen` is always rendered, so its state is kept.

## Skills practised

React components and props, `useState`, controlled `select` inputs, `filter`, `map` and `slice`, derived values, function props, conditional rendering and basic CSS layout.
