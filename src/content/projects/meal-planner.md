---
name: Meal Planner
tech: [Next.js, TypeScript, Supabase, PostgreSQL, Vercel, Vitest, Playwright]
links:
  - label: Try it live
    url: https://meal-planner-ten-gray.vercel.app
date: 2026-08-19
---

A meal-planning web app my household actually runs on: a shared weekly calendar of breakfasts, lunches and dinners, a family recipe cookbook with import from Spoonacular, and a grocery list generated from the week's plan whose check-offs survive replanning. Next.js route handlers on Vercel serve both UI and API over Supabase Postgres, with Google sign-in, explicit SQL and deny-all row-level security as a backstop, CI that greps the built client bundle for leaked secret values, and unit, integration and Playwright end-to-end test layers. Open to anyone — sign in with a Google account and it sets up a kitchen of your own.
