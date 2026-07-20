# Tyree Hub v1.1.0 Implementation and Acceptance Report

**Completion date:** July 20, 2026  
**Data schema:** 2  
**Service-worker cache:** `tyree-hub-shell-v1.1.0`  
**Primary target:** Android mobile browser and installable PWA  
**Hosting target:** `https://bill6006.github.io/My-Hub/`

## Update scope

Version 1.1.0 adds optional per-app GitHub upload shortcuts without redesigning the existing dashboard or exposing development controls on the Home screen.

Implemented behavior:

- A subtle collapsible **Developer shortcut** section appears in Add App and Edit App.
- The optional field accepts secure GitHub repository upload pages.
- A valid field reveals a restrained **Open upload page** test button.
- Apps with a valid saved shortcut gain **Upload update** inside the existing Manage-mode three-dot menu.
- Apps without a shortcut show no disabled button, icon, placeholder, or reserved space.
- No upload shortcut appears on Home, Favorites, Recently Opened, normal search results, or bottom navigation.
- Tyree Hub only opens the exact saved GitHub URL. It does not upload automatically or use GitHub credentials or APIs.

## URL validation

Accepted shortcuts must:

- Use `https://`
- Use the `github.com` hostname
- Include an owner
- Include a repository
- Include `/upload/`
- Include a branch name
- Optionally include a folder path after the branch

Example:

```text
https://github.com/bill6006/My-Hub/upload/main
```

Leading and trailing whitespace is removed. Repository owner, name, branch, capitalization, folder path, query string, and fragment are otherwise preserved.

## Data compatibility

The optional app property is:

```text
githubUploadUrl
```

Compatibility behavior passed:

- Existing schema-1 local data migrates to schema 2.
- Existing app names, normal URLs, ordering, favorites, hidden state, categories, timestamps, theme, and lock data remain intact.
- Missing `githubUploadUrl` values become an empty string.
- Duplicating an app copies its valid shortcut.
- Clearing the field removes the Manage action.
- Restoring defaults remains functional.
- Exported backups include valid shortcuts.
- Schema-1 backups without the property import successfully.
- Schema-2 backups restore valid shortcuts.
- Malformed optional shortcuts are stripped while the related app is preserved.
- Import preview warns about malformed optional shortcuts.
- Rollback storage is still created before import.

## Management Lock

The GitHub action is a management function and follows the existing Management Lock behavior.

Passed:

- A new locked session requests the PIN before Manage mode opens.
- Management controls remain unavailable until unlocked.
- Upload shortcuts remain unavailable while locked.
- Normal Home launching remains unaffected.

## Mobile and interaction testing

Automated Chromium interface tests passed at:

- 320px
- 360px
- 375px
- 412px

Passed checks include:

- No horizontal overflow
- Developer shortcut field fits inside the sheet
- Valid link saves successfully
- Exact GitHub URL is preserved
- Open upload page action targets the exact saved URL
- Home contains no visible upload action
- Only qualifying Manage cards show Upload update
- App without shortcut shows no action
- Invalid non-GitHub URL receives inline validation
- Invalid value does not save
- Duplicate preserves shortcut
- Clearing shortcut removes action
- No captured JavaScript runtime errors

A total of **72 automated functional and compatibility assertions** passed across the primary and extended test runs.

## Backup testing

Passed:

- Exported JSON uses schema 2.
- Export includes `githubUploadUrl` for applicable apps.
- Older schema-1 backup imports successfully.
- New schema-2 backup restores the shortcut.
- Invalid optional shortcut produces a warning.
- Invalid optional shortcut alone is removed.
- Remaining app data is preserved.
- Automatic rollback data is created.

## Static checks

Passed:

- `js/app.js` JavaScript syntax validation
- `sw.js` JavaScript syntax validation
- Manifest JSON validation
- No duplicate HTML IDs
- Required project assets exist
- Relative project asset paths remain intact
- Service-worker cache version was advanced
- External GitHub pages are not included in the app-shell cache
- No default app was assigned an inferred GitHub repository URL

## Files changed in v1.1.0

- `index.html`
- `css/styles.css`
- `js/app.js`
- `sw.js`
- `README.md`
- `ACCEPTANCE_REPORT.md`
- `SHA256SUMS.txt`

No icon or manifest changes were required.

## Deployment readiness

**Status: PASS**

The update is ready for the existing `bill6006/My-Hub` GitHub Pages repository.
