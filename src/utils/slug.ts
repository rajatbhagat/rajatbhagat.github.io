// URL-safe slug for a category name: "Movie Reviews" -> "movie-reviews".
// Display names keep their original casing; URLs always use the slug, so
// "movies", "Movies", and "MOVIES" are one category.
export function slugifyCategory(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
