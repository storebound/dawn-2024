# Blog Listing Page Bug - Rise Blog Template

## Issue Summary
On the rise-blog template (`templates/blog.rise-blog.json` using `sections/main-blog.liquid`), only ~10 most recent recipes are showing across all category sections, even though there are 50+ articles tagged for each category.

**Symptoms:**
- Some categories appear full, others have no recipes showing
- Only the most recent articles appear, older tagged articles are missing
- One category (e.g., "Cookware") shows only 1 article despite 50+ articles having that tag

## Root Cause Identified
**Shopify Liquid has a hard limit of 50 iterations per `for` loop.**

From Shopify docs:
> "You can do a maximum of 50 iterations with a for loop. If you need to iterate over more than 50 items, then use the paginate tag to split the items over multiple pages."

Additionally:
- The `paginate` tag has a maximum `page_size` of **250** (code had 1000, which is invalid)
- The `limit` parameter on a for loop can only *reduce* iterations below 50, not increase above it

### How the current code fails

In `sections/main-blog.liquid` around line 390, the code loops through `blog.articles` **separately for each category block**:

```liquid
{% for block in section.blocks %}        <!-- 8 categories -->
  ...
  {% for cat_article in blog.articles %} <!-- Limited to 50 iterations! -->
    {% if article has matching tag %}
      add to category
    {% endif %}
  {% endfor %}
{% endfor %}
```

Since each category's loop only checks the first 50 articles (sorted by most recent), articles beyond position 50 are never found. If "Cookware" articles are mostly older than the 50 most recent, they won't appear.

## What We Tried

### Attempt 1: Add `limit: 1000` to the for loop
```liquid
{% for cat_article in blog.articles limit: 1000 %}
```
**Result:** Did not work. The `limit` parameter cannot exceed the 50-iteration cap.

### Attempt 2: Pre-build article lists in a single pass
Changed pagination from 1000 to 250 (valid max), then added logic to:
1. Iterate through all articles ONCE before the category loop
2. Bucket article handles by tag into a structured string
3. Have each category look up handles from pre-built data

**Result:** Did not work. Likely still hitting iteration limits or the string parsing approach had issues.

## Potential Solutions to Try

### Option 1: Populate metaobject fields manually
The metaobjects (`recipe_tag_group`) have `recipe_1`, `recipe_2`, `recipe_3` fields that are currently blank. If these are populated with specific article handles, the code uses them directly without needing to loop through all articles.

**Pros:** Avoids the loop entirely
**Cons:** Manual maintenance, limited to 3 featured articles per category

### Option 2: Use AJAX/JavaScript approach
Load articles dynamically via the Storefront API or AJAX calls after page load.

**Pros:** No Liquid iteration limits
**Cons:** More complex, requires API setup

### Option 3: Multiple paginate blocks
Use separate `{% paginate %}` blocks for each category, though this may hit other Shopify limits.

### Option 4: Debug with output
Add temporary debug output to see:
- How many articles `blog.articles` actually contains
- Which articles are being checked
- Why tag matching might be failing

```liquid
{{ blog.articles.size }} <!-- Total articles available -->
{{ blog.articles | map: 'handle' | join: ', ' }} <!-- Which articles -->
```

## Relevant Files
- `templates/blog.rise-blog.json` - Template configuration with filter blocks
- `sections/main-blog.liquid` - Main section with the iteration logic (lines 338-532)
- Metaobjects: `shop.metaobjects.recipe_tag_group` - Category configuration

## Key Code Location
The problematic loop is in `sections/main-blog.liquid` starting around line 385-408 (in the "Get recent articles from this category if needed" section).

## Resources
- [Shopify Liquid for loop docs](https://shopify.dev/docs/api/liquid/tags/for) - Documents 50 iteration limit
- [Shopify paginate tag docs](https://shopify.dev/docs/api/liquid/tags/paginate) - Max page_size is 250
