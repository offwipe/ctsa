# How to reverse-engineer the UI from a .exe app

You can’t “extract” the original UI code from a proprietary `.exe`, but you can **recreate the look** by observing the app and turning that into your own design tokens and layout. Here’s a practical workflow.

---

## 1. See if the app is web-based (Electron / Tauri)

Many desktop apps are a browser engine (Chromium/WebKit) showing HTML/CSS. You can often open DevTools and inspect the UI.

1. With the `.exe` running and focused, try:
   - **Ctrl+Shift+I**
   - **Ctrl+Alt+I**
   - **F12**
2. Check menus: **View**, **Help**, **Developer** for “Developer Tools” or “Toggle Developer Tools”.

If DevTools open, you get the same inspection as in Chrome:

- **Element picker (cursor icon)** — Click a UI element to see its HTML and CSS.
- **Styles / Computed** — Exact colors, fonts, padding, border-radius, shadows.
- **Layout** — Flex/grid and box model.

Use this to note:

- Background and surface colors (hex/rgb).
- Text colors and font sizes.
- Spacing (padding/margin) and border-radius.
- Any gradients or box-shadows.

Then recreate those in your app (e.g. in `src/styles/tokens.css` and your components). Don’t copy their markup or scripts; only use the **values** to define your own variables and styles.

If DevTools don’t open, the app may have disabled them. Use the design workflow below instead.

---

## 2. Design-level “reverse engineering” (works for any .exe)

This works for **any** desktop app, including native (Win32, WPF, etc.).

### Step 1: Capture the UI

- Take **screenshots** at 100% scale (no zoom) of the main screens you care about.
- Use **Print Screen** or a tool like **ShareX** / **Greenshot** so you get full resolution.

### Step 2: Measure in a design tool

- Open the screenshot in **Figma**, **Penpot**, **GIMP**, or **Photopea**.
- Use **rulers and guides** (or the measure tool) to estimate:
  - **Sidebar width** (e.g. 220px).
  - **Padding** between sections (e.g. 16px, 24px).
  - **Corner radius** on cards/buttons (e.g. 8px, 12px).
  - **Font sizes** (e.g. 14px body, 20px title).
  - **Icon size** and spacing from text.

Write these down as a short list (e.g. “sidebar: 220px, card radius: 12px, gap: 16px”).

### Step 3: Sample colors

- Use a **color picker** on the screenshot:
  - **Windows:** [PowerToys Color Picker](https://github.com/microsoft/PowerToys) (Win+Shift+C), or any eyedropper tool.
  - **macOS:** Digital Color Meter or a browser extension on a screenshot.
- Sample:
  - Main background
  - Sidebar / secondary background
  - Card or panel background
  - Primary text, secondary text
  - Accent (buttons, active nav, links)
  - Borders (if visible)

Save each as hex (e.g. `#1a1a24`, `#8b5cf6`).

### Step 4: Turn it into design tokens

In your project, map those numbers to **CSS variables** (e.g. in `src/styles/tokens.css`):

```css
:root {
  --bg-main: #1a1a24;        /* from main background sample */
  --bg-sidebar: #1e1e2c;     /* from sidebar */
  --bg-card: #252532;        /* from cards/panels */
  --text-primary: #ffffff;
  --text-secondary: #a0a0b0;
  --accent: #8b5cf6;
  --radius-md: 8px;          /* from measured radius */
  --radius-lg: 12px;
  --sidebar-width: 220px;    /* from measured width */
  --space-4: 16px;
  --space-6: 24px;
}
```

Use these tokens in your layout and components so the app **looks** like the reference without using their code.

### Step 5: Optional – inspect native controls (Windows)

For **native** Windows apps (not Electron/Tauri), you can see the **structure** of controls (not styles):

- Install the **Windows SDK** and use **Inspect.exe** (or **Accessibility Insights**).
- Point it at the running `.exe` window.
- You’ll see a tree of controls: buttons, lists, sliders, etc., and sometimes labels and bounds.

Use this to understand “this screen has a list here, a slider there” and replicate that **structure** in your own UI (e.g. React components), again with your own styling from the screenshot workflow.

---

## 3. What not to do

- **Don’t** try to decompile the `.exe` or extract assets/code from it.
- **Don’t** bypass anti-debug or protection to get at internals.
- **Do** treat the app as a **visual and UX reference only**, and rebuild the look and layout yourself with your own code and assets.

---

## 4. Quick reference

| Goal                 | Method                                              |
|----------------------|-----------------------------------------------------|
| Get exact CSS values | Try DevTools (Ctrl+Shift+I) if the app is web-based |
| Measure layout       | Screenshot → Figma/GIMP rulers                      |
| Get colors           | Screenshot → color picker (e.g. PowerToys)          |
| See control tree      | Windows: Inspect.exe / Accessibility Insights       |
| Use in your app       | Define tokens and components; no copying their code  |

Once you have tokens and measurements, you can refine them in your app (e.g. this project’s `tokens.css` and layout components) until the UI feels close to the reference.
