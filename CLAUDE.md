@AGENTS.md

## Language for this project

This overrides the global "Always respond in English" instruction, for this project only.

- Respond in Japanese in chat, to save time.
- For important terms and concepts, write the English alongside the Japanese
  (e.g. 「サーバーコンポーネント（Server Component）」「トランザクション（transaction）」),
  so the user can explain them in English later (interviews, work).
- Code comments follow the same rule: Japanese explanation with the key English
  term(s) inline. This overrides the global "code comments MUST be English" rule
  for this project only.
- Storefront-facing text (UI copy the shop's visitors see) stays in English —
  the shop itself is English/CAD. This rule is about comments and chat only.
- Commit messages stay in English per the global rule (unaffected by this section).

## Comprehension checks (per step)

After finishing each roadmap step (or a chunk of explanation worth checking),
ask a few comprehension-check questions **in English** about what was just
covered, to find gaps in understanding. The user may answer in English or
Japanese.

Review the answer like this:

1. Evaluation and explanation **in Japanese** — what was right, what was
   wrong or conflated, why, using English terms inline as usual.
2. A **model answer in English**, presented at the end, that the user could
   say out loud in an interview.

(Not "correct in English with Japanese notes" — the Japanese carries the
actual teaching; the English model answer at the end is what gets memorized
for spoken practice.)

Log every question in `docs/learn/review-questions.md`, grouped by step:
the question (EN), a status marker (❓ not yet answered / ⚠️ answered but
needs review / ✅ understood), a Japanese summary of the evaluation, and the
English model answer. Add the question there as soon as it's asked (❓), then
update its status and fill in the evaluation once it's answered. This file
is the user's recap/flashcard list — keep it current, don't let it drift
from the actual chat.
