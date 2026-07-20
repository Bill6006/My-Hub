# Tyree Hub

Tyree Hub is a mobile-first personal launcher for web apps, tools, and conversations. It is designed to feel like a modern Android app while remaining a lightweight static website that can be hosted free through GitHub Pages.

## Included default apps

1. Speech Coach
2. Life Command Center
3. Tailored Training

The URLs are stored in `js/app.js` inside the `DEFAULT_APPS` array.

## Main features

- Add unlimited custom launcher tiles within the browser's available local storage
- Edit, duplicate, hide, delete, favorite, and reorder apps
- Search and category filtering
- Recently opened tracking
- Optional GitHub upload shortcuts for individual apps
- Light, dark, and system themes
- JSON backup with merge and replace restore modes
- Optional four-digit Management Lock for accidental-change protection
- Installable Progressive Web App support
- Offline loading of the Tyree Hub interface after the first successful visit
- No accounts, analytics, advertisements, trackers, databases, or external APIs

## GitHub upload shortcuts

Each app can optionally store a separate GitHub upload-page URL. This is useful when you receive a replacement `index.html` or another updated project file.

To add one:

1. Open **Add app** or edit an existing app.
2. Open the subtle **Developer shortcut** section.
3. Paste the repository upload page, for example:

```text
https://github.com/bill6006/My-Hub/upload/main
```

4. Save the app.
5. Enter **Manage** mode, open the app card's three-dot menu, and tap **Upload update**.

The upload shortcut never appears on the normal Home dashboard. Apps without a valid shortcut show no upload action or empty placeholder.

Tyree Hub only opens the saved GitHub page. It does not upload files automatically, store GitHub credentials, or use the GitHub API.

## Project structure

```text
tyree-hub/
├── index.html
├── manifest.webmanifest
├── sw.js
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── maskable-icon-512.png
├── ACCEPTANCE_REPORT.md
└── README.md
```

## Test locally

A service worker does not run correctly when opening `index.html` directly from a file browser. Use a small local web server instead.

### Python

1. Open a terminal in the `tyree-hub` folder.
2. Run:

```bash
python -m http.server 8080
```

3. Open `http://localhost:8080` in Chrome.

### Node.js

```bash
npx serve .
```

Open the local address shown in the terminal.

## Upload to the existing My-Hub repository

1. Sign in to GitHub and open the `bill6006/My-Hub` repository.
2. Upload project files into their matching repository locations.
3. Keep `index.html`, `manifest.webmanifest`, and `sw.js` at the repository root.
4. Keep `styles.css` inside `css/` and `app.js` inside `js/`.
5. Commit the changes.
6. Confirm GitHub Pages still publishes from `main` and `/ (root)`.
7. Open:

```text
https://bill6006.github.io/My-Hub/
```

The app uses relative asset paths, so it works from a GitHub Pages project subfolder.

## Install on Android

1. Open the published Tyree Hub link in Chrome.
2. Open Chrome's three-dot menu.
3. Choose **Install app** or **Add to Home screen**.
4. Confirm.
5. Tyree Hub should appear on the home screen and in the Android app drawer.

Chrome may also show an install option inside Tyree Hub Settings when the browser exposes the installation prompt.

## Backups

Open **Settings**, then choose **Export backup**. Tyree Hub downloads a readable JSON file containing apps, order, favorites, hidden state, categories, recent-opened timestamps, visual preferences, and valid GitHub upload shortcuts.

Management Lock PIN data is intentionally not exported. Restored backups begin with Management Lock disabled so a backup cannot lock the user out with an unknown PIN.

During import:

- **Merge** adds apps whose normal website URLs do not already exist.
- **Replace** replaces the current hub with the backup.
- Tyree Hub stores an automatic rollback copy before applying an import.
- Older schema-1 backups remain valid and receive an empty GitHub shortcut field.
- A malformed optional GitHub shortcut is ignored while the rest of that app is preserved.

Keep exported backups somewhere safe when moving to a new phone or clearing browser storage.

## Change the default apps

Open `js/app.js` and locate `DEFAULT_APPS` near the top. Each default app includes:

- `id`
- `name`
- `url`
- `githubUploadUrl`
- `description`
- `category`
- `iconType`
- `icon`
- `accent`
- `openMode`

Keep each default `id` unique and stable. The app ID is how Tyree Hub recognizes the original launchers when restoring defaults.

After changing code, update both:

- `APP_VERSION` in `js/app.js`
- `CACHE_VERSION` in `sw.js`

Changing the service-worker cache version allows existing installations to detect and apply the new app shell.

## Change the app name

Update these locations:

- `<title>` and visible text in `index.html`
- `name` and `short_name` in `manifest.webmanifest`
- Text in `README.md`

## Change icons

Replace the PNG files in `icons/` while keeping the same dimensions and filenames:

- `icon-192.png`: 192 by 192 pixels
- `icon-512.png`: 512 by 512 pixels
- `maskable-icon-512.png`: 512 by 512 pixels with important artwork kept inside the central safe zone

## Important PWA limitations

- The first visit must be online so the browser can download and cache Tyree Hub.
- The hub interface can reopen offline after it has been cached.
- Linked external websites and GitHub upload pages still require network access.
- Install wording varies by Android phone, Chrome version, and browser.
- Data is local to the browser profile. Clearing site data or uninstalling without a backup can remove custom apps.
- Management Lock is designed to prevent accidental changes. It is not encryption and includes a local reset option.

## Troubleshooting

### The new GitHub shortcut feature does not appear

1. Confirm the four updated app files were uploaded to their exact repository paths.
2. Open Tyree Hub while online.
3. Wait briefly for the update notice.
4. Tap **Update now**, or fully close and reopen the installed app.
5. Confirm `sw.js` contains cache version `tyree-hub-shell-v1.1.0`.

### The Upload update action is missing

- Confirm you are in **Manage** mode.
- Edit the app and verify its Developer shortcut is a secure URL matching `https://github.com/OWNER/REPOSITORY/upload/BRANCH`.
- Apps with a blank or invalid shortcut intentionally show no action.

### The install option does not appear

- Confirm the site is opened through HTTPS on GitHub Pages, not as a local file.
- Reload once after the first visit.
- Open Chrome's menu and look for **Install app** or **Add to Home screen**.
- Confirm the manifest, service worker, and icon files return successfully.

### An old version keeps opening

1. Open Tyree Hub while online.
2. Leave it open briefly so the service worker can check for an update.
3. Use the in-app update notice when it appears.
4. If needed, close and reopen the installed app.
5. Confirm `CACHE_VERSION` was changed when publishing the update.

### Custom apps disappeared

- Check whether Chrome site data was cleared.
- Import the most recent Tyree Hub JSON backup.
- Confirm the app is not hidden or filtered out.

### A link opens in the browser instead of another Android app

Android decides whether a website link is handled by an installed native app. Tyree Hub safely opens the saved URL, but the destination app and Android link settings control the final behavior.

### GitHub Pages shows a 404

- Confirm Pages is enabled for the repository.
- Confirm `index.html` is at the published root.
- Confirm the repository name and URL capitalization.
- Wait for the Pages deployment workflow to finish, then reload.
