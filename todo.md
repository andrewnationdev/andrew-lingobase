# Improvement TODO

This file collects concrete improvement ideas found during a repository scan. Each item includes the affected file, the current code pattern, and the suggested fix.

## High Priority

- [X] Fix the broken signup CTA on the landing page.
  - File: [app/page.tsx](app/page.tsx)
  - Current snippet: `href="/register"`
  - Problem: the app appears to use `/auth/sign-up` everywhere else, so `/register` can lead to a 404 or a dead end.
  - Suggested change: point the CTA to the existing sign-up route or add a matching route if `/register` is meant to exist.

- [X] Add stronger typing to the home page `Card` component.
  - File: [app/page.tsx](app/page.tsx)
  - Current snippet: `const Card = ({ title, children }) => (`
  - Problem: `title` and `children` are implicitly `any`-ish here, which weakens TypeScript coverage.
  - Suggested change: define a typed props interface, for example `React.PropsWithChildren<{ title: string }>`.

- [ ] Replace the hard-coded `user` claim handling with a narrower type.
  - File: [app/page.tsx](app/page.tsx), [app/dashboard/page.tsx](app/dashboard/page.tsx), [app/dashboard/layout.tsx](app/dashboard/layout.tsx)
  - Current snippet: `const { data } = await supabase.auth.getClaims(); const user = data?.claims;`
  - Problem: claim data is consumed as if it is always shaped correctly, but the code does not define or validate that shape.
  - Suggested change: introduce a shared auth claim type and guard optional fields before use.

- [ ] Validate the conlang create/edit payload before sending it to Supabase.
  - File: [components/ui/conlang-edit.tsx](components/ui/conlang-edit.tsx)
  - Current snippet: `const conlang_with_user = { ...conlang, code: conlang.code.toUpperCase().trim(), created_by: userName || "anonymous", custom_links: conlang.custom_links ?? defaultLinks, };`
  - Problem: the form accepts free-form text for all fields, but there is no validation for URL shape, code format, or required trim/non-empty constraints beyond the HTML controls.
  - Suggested change: validate and normalize values before insert/update, especially `code`, `english_name`, `native_name`, and custom link URLs.

- [ ] Handle the Supabase duplicate-code check more explicitly.
  - File: [components/ui/conlang-edit.tsx](components/ui/conlang-edit.tsx)
  - Current snippet: `if (fetchError && (fetchError as any).code !== "PGRST116") { ... }`
  - Problem: the code relies on an `any` cast and a magic error code.
  - Suggested change: create a typed guard for PostgREST errors and avoid suppressing type checking with `any`.

- [X] Prevent silent failures after conlang delete.
  - File: [components/ui/conlang-view.tsx](components/ui/conlang-view.tsx)
  - Current snippet: `try { const req = await supabase.from("conlang").delete().eq("code", id); ... } catch (err) { console.error(err); }`
  - Problem: deletion errors are only logged, and the user gets no feedback if the cascade cleanup fails.
  - Suggested change: surface a visible error state/toast and verify all delete operations before redirecting.

- [ ] Validate comment and rating updates before writing them.
  - File: [components/ui/conlang-view.tsx](components/ui/conlang-view.tsx)
  - Current snippet: `const updatedComments = [...existing, comment];` and `const data = [...conlang.ratings.likes, loggedUser];`
  - Problem: duplicate likes/dislikes and malformed comment payloads can be introduced if the UI or client state is inconsistent.
  - Suggested change: check for duplicate usernames, normalize comment shape, and reject empty or malformed comments.

## Type Safety

- [X] Remove `any[] | null` from the tutorial fetch example.
  - File: [components/tutorial/fetch-data-steps.tsx](components/tutorial/fetch-data-steps.tsx)
  - Current snippet: `const [notes, setNotes] = useState<any[] | null>(null)`
  - Problem: the tutorial encourages unsafe typing in a codebase that otherwise uses TypeScript.
  - Suggested change: define a `Note` interface and type the state as `Note[] | null`.

- [X] Type the note editor state and event handler.
  - File: [components/ui/texteditor.tsx](components/ui/texteditor.tsx)
  - Current snippet: `function useDebounce(value, delay) { ... }`, `const [content, setContent] = useState('');`, `const handleChange = (e) => { ... }`
  - Problem: the component currently has untyped hook parameters and an untyped change handler.
  - Suggested change: add explicit `string`/`number` types to the hook and `React.ChangeEvent<HTMLTextAreaElement>` to the handler.

- [X] Type the dictionary utility result containers.
  - File: [lib/dictionary.ts](lib/dictionary.ts)
  - Current snippet: `let duplicates = []` and `let homonyms = []`
  - Problem: empty arrays infer `never[]` or weakly inferred array types depending on usage, which makes the code fragile.
  - Suggested change: declare the arrays as `IWord[]` and return a dedicated result type with `data: IWord[] | undefined`.

- [X] Normalize the `IResult` interface in the dictionary utilities.
  - File: [lib/dictionary.ts](lib/dictionary.ts)
  - Current snippet: `export interface IResult { number: number; data: IWord[] | undefined; }`
  - Problem: `data` being `undefined` forces repeated null checks and does not clearly describe empty-result semantics.
  - Suggested change: use `data: IWord[]` and represent empty results with `[]`.

- [ ] Add a shared type for conlang and nested custom links.
  - File: [components/ui/conlang-edit.tsx](components/ui/conlang-edit.tsx), [components/ui/conlang-view.tsx](components/ui/conlang-view.tsx), [components/ui/grammar/grammar-view.tsx](components/ui/grammar/grammar-view.tsx)
  - Current snippet: ad hoc object literals such as `custom_links: { link1: { title: "", url: "" }, link2: { title: "", url: "" } }`
  - Problem: the same data shape is duplicated across multiple files and can drift over time.
  - Suggested change: move the shape into a shared type or schema module.

## Bug-Prone Logic

- [X] Stop reloading the page after deleting a dictionary entry.
  - File: [components/ui/dictionary.tsx](components/ui/dictionary.tsx)
  - Current snippet: `window.location.reload();`
  - Problem: full-page reloads mask state bugs and create a worse UX than updating local state.
  - Suggested change: refresh the dictionary state in React after the delete succeeds.

- [X] Handle possible null Supabase responses in dictionary refresh flows.
  - File: [components/ui/dictionary.tsx](components/ui/dictionary.tsx)
  - Current snippet: `setLexicon(lex?.data);` and `setLexicon(lex?.data || []);`
  - Problem: the state is sometimes assigned `undefined`, even though later code assumes an array.
  - Suggested change: always coerce to `[]` and handle query errors explicitly.

- [X] Fix the button hover color typo on delete actions.
  - File: [components/ui/dictionary.tsx](components/ui/dictionary.tsx)
  - Current snippet: `hover:bg-emerald-600` on the red delete button
  - Problem: the hover color does not match the destructive intent and looks inconsistent.
  - Suggested change: use a red hover class for destructive actions.

- [X] Avoid duplicate work in `calculateDuplicateEntries` and `calculateHomonyns`.
  - File: [lib/dictionary.ts](lib/dictionary.ts)
  - Current snippet: nested loops that compare each word against every other word and increment `counter` on every pair match.
  - Problem: the current algorithm counts the same logical duplicate many times and can over-report duplicates/homonyms.
  - Suggested change: compare each pair once or use a map keyed by normalized lexical item + definition.

- [X] Guard against empty or missing strings in dictionary analytics.
  - File: [lib/dictionary.ts](lib/dictionary.ts)
  - Current snippet: `currWord.lexical_item.toLowerCase()` and `currWord.definition.toLowerCase()`
  - Problem: if data is incomplete, these calls can throw at runtime.
  - Suggested change: normalize with safe fallback strings before calling string methods.

- [ ] Make profile display lookups handle missing aliases and query errors more consistently.
  - File: [lib/user-utils.ts](lib/user-utils.ts)
  - Current snippet: `if (error) { return result; }` and `if (alias && String(alias).trim().length > 0) { ... }`
  - Problem: failures are silently swallowed, which makes user-facing names harder to debug.
  - Suggested change: distinguish "not found" from "query failed" and log or surface failures when appropriate.

## Validation and Data Integrity

- [X] Validate local-storage content in the notepad before persisting.
  - File: [components/ui/texteditor.tsx](components/ui/texteditor.tsx)
  - Current snippet: `localStorage.setItem(localStorageKey, debouncedContent);`
  - Problem: any string is saved without size checks or migration logic.
  - Suggested change: guard against oversized content and version the stored format if the editor schema changes.

- [X] Validate external link data before rendering it as clickable navigation.
  - File: [app/dashboard/page.tsx](app/dashboard/page.tsx), [components/ui/conlang-edit.tsx](components/ui/conlang-edit.tsx)
  - Current snippet: `href={link.url}` and user-authored custom links in conlang data.
  - Problem: malformed URLs can break navigation or create bad external-link behavior.
  - Suggested change: validate URLs on input and render only safe, well-formed destinations.

## Styling and Consistency

- [ ] Replace raw `<img>` usage with `next/image` where possible.
  - File: [app/page.tsx](app/page.tsx), [app/dashboard/layout.tsx](app/dashboard/layout.tsx)
  - Current snippet: `<img src="/img/LINGOBASE_4.webp" width="32px" height="32px" />`
  - Problem: raw images skip built-in optimization and often miss accessibility details like alt text.
  - Suggested change: use `next/image` and add meaningful alt text.

- [X] Remove duplicate `transition` classes and inconsistent hover scales.
  - File: [app/page.tsx](app/page.tsx), [app/dashboard/page.tsx](app/dashboard/page.tsx)
  - Current snippet: classes such as `transition duration-150 ease-in-out hover:scale-125 ... transition-colors duration-200`
  - Problem: multiple transition declarations overlap, and hover scaling is inconsistent across CTAs.
  - Suggested change: standardize a small button/link utility pattern and reuse it everywhere.

- [X] Fix invalid Tailwind-like classes that likely do nothing.
  - File: [components/ui/texteditor.tsx](components/ui/texteditor.tsx), [app/dashboard/page.tsx](app/dashboard/page.tsx)
  - Current snippet: `light:bg-white`, `light:text-gray-800`, `light:bg-orange-100`
  - Problem: `light:` is not a standard Tailwind variant in this codebase, so those classes may be ignored.
  - Suggested change: replace them with plain classes or a supported theme strategy.

- [X] Make the notepad screen visually consistent with the rest of the app.
  - File: [components/ui/texteditor.tsx](components/ui/texteditor.tsx)
  - Current snippet: `className="min-h-screen flex items-center justify-center font-inter"`
  - Problem: `font-inter` does not match the rest of the app typography, and the layout appears disconnected from the dashboard style.
  - Suggested change: reuse the app’s primary font and shared surface/background tokens.

- [X] Align the protected layout and landing page navigation branding.
  - File: [app/layout.tsx](app/layout.tsx), [app/dashboard/layout.tsx](app/dashboard/layout.tsx), [app/page.tsx](app/page.tsx)
  - Current snippet: `Andrew Lingobase (Early Access)` on one page and `LINGOBASE (BETA)` on another.
  - Problem: the brand copy is inconsistent across entry points.
  - Suggested change: centralize the product name and status label in a shared constant.

- [ ] Clean up mixed spacing and nesting in the dashboard page layout.
  - File: [app/dashboard/page.tsx](app/dashboard/page.tsx)
  - Current snippet: the first child is rendered with inconsistent indentation and several sections repeat the same container patterns.
  - Problem: layout structure is harder to scan and maintain.
  - Suggested change: extract repeated section wrappers and normalize indentation/spacing.

## Maintainability

- [X] Replace console logging with structured error handling where users rely on the result.
  - File: [components/ui/conlang-view.tsx](components/ui/conlang-view.tsx), [components/ui/grammar/grammar-view.tsx](components/ui/grammar/grammar-view.tsx), [components/ui/texteditor.tsx](components/ui/texteditor.tsx)
  - Current snippet: `console.log(...)`, `console.debug(...)`, `console.error(...)`
  - Problem: logs are useful during development but do not help end users when something fails.
  - Suggested change: keep logs for debugging, but pair them with user-visible fallback states or toasts where appropriate.

- [X] Consolidate repeated empty-state and loading UI patterns.
  - File: [components/ui/dictionary.tsx](components/ui/dictionary.tsx), [components/ui/conlang-view.tsx](components/ui/conlang-view.tsx), [components/ui/grammar/grammar-view.tsx](components/ui/grammar/grammar-view.tsx)
  - Current snippet: multiple ad hoc loading spinners, alert cards, and empty-state blocks.
  - Problem: the same UX patterns are implemented slightly differently in multiple places.
  - Suggested change: extract a shared loading/empty-state component and reuse it.

- [ ] Revisit the frequent `useEffect` dependencies that re-fetch on local state changes.
  - File: [components/ui/dictionary.tsx](components/ui/dictionary.tsx)
  - Current snippet: `useEffect(..., [editing, word, data]);`
  - Problem: editing a word causes refetches that may be broader than necessary, which can create avoidable network traffic and state churn.
  - Suggested change: depend on a narrower trigger or refresh only after save/delete actions.

- [ ] Consider factoring repeated Supabase read logic into shared helpers.
  - File: [components/ui/conlang-view.tsx](components/ui/conlang-view.tsx), [components/ui/grammar/grammar-view.tsx](components/ui/grammar/grammar-view.tsx), [components/ui/dictionary.tsx](components/ui/dictionary.tsx)
  - Current snippet: repeated `supabase.from(...).select(...).eq(...);` patterns.
  - Problem: similar fetch logic appears in multiple components and is easy to drift.
  - Suggested change: extract small repository helpers for the most common queries.
