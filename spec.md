# Specification

## Summary
**Goal:** Remove the BookOpen, MessageSquare, Hash, Layers, and HandMetal icons (and their associated headline/label text) from all frontend components in the SilentLearn app.

**Planned changes:**
- Remove all imports and usages of `BookOpen`, `MessageSquare`, `Hash`, `Layers`, and `HandMetal` icons from every frontend file (including Navbar.tsx, Dashboard.tsx, LessonCard.tsx, Help.tsx, and any other affected components).
- Replace each removed icon+headline pair with plain text labels or alternative icons already used elsewhere in the app, so no UI section loses its label or becomes broken.

**User-visible outcome:** The app renders without the specified icons; all previously labeled sections still display their text labels correctly and the app compiles without errors.
