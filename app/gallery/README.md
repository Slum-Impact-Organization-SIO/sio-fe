# Cloudinary Sync & Year Filtering (No Hardcoded Media)

To keep this website completely free of hardcoded image files, the gallery loads its photo and video arrays dynamically from your Cloudinary Media Library (Cloud Name: `dquzcqxcy`) using Cloudinary's native **Resource List API**.

If this API is not configured yet, the page automatically falls back to reading links from [public/gallery-images.json](file:///C:/Users/Jaymi/source/repos/sio-fe/public/gallery-images.json).

---

## Method A: The Zero-Maintenance Cloudinary Sync (Recommended)

This method lets you tag files in Cloudinary, and the website will automatically pull and categorize them by year (2019-2026) based on their folder structure, without changing any code or JSON files!

### 1. Organize Folders in Cloudinary

Ensure your files in Cloudinary are grouped in subfolders named after the year (e.g. `2019` to `2026`).

### 2. Tag Your Media

1. In your Cloudinary Media Library, select all the images and videos you want to show in the SIO gallery.
2. Add the tag **`sio-gallery`** to all of them.

### 3. Enable Public Resource Lists (Required once)

By default, Cloudinary restricts anonymous listings for security. You must enable it in your dashboard settings:

1. Go to **Settings** (gear icon in the bottom-left of Cloudinary Console).
2. Click the **Security** tab.
3. Scroll down to the **Restricted media types** section.
4. **Uncheck** the box for **Resource list**. (This allows the website to query the list of tagged items).
5. Click **Save** at the bottom.

_Once saved, the website will query `https://res.cloudinary.com/dquzcqxcy/image/list/sio-gallery.json` dynamically and render them!_

---

## Method B: Manual JSON Catalog (Fallback)

If you prefer not to enable Resource Lists, you can paste the direct Cloudinary URLs (from your collection or library) into [public/gallery-images.json](file:///C:/Users/Jaymi/source/repos/sio-fe/public/gallery-images.json):

```json
{
  "images": [
    "https://res.cloudinary.com/dquzcqxcy/image/upload/v1234567/2026/outreach_tutoring.jpg",
    "https://res.cloudinary.com/dquzcqxcy/image/upload/v1234567/2025/outreach_nutrition.jpg"
  ],
  "videos": ["https://res.cloudinary.com/dquzcqxcy/video/upload/v1234567/2026/mentorship_match.mp4"]
}
```

---

## How Year Filters are Generated:

- The website scans the URL paths (looking for segments like `/2026/` or `/2025/`).
- It automatically creates year toggle pills (e.g. **All Years**, **2026**, **2025**) _only_ for the years that actually have files.
