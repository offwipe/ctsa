// Framework: Tauri v2 (Rust + WebView2 on Windows)
//
// Rounded window approach:
//   1. tauri.conf.json: decorations=false, transparent=true, shadow=false
//   2. The native OS titlebar is removed (decorations=false)
//   3. The WebView2 surface is transparent (transparent=true)
//   4. CSS border-radius on .app-shell clips content to a rounded shape
//   5. Areas outside the border-radius are transparent, showing the desktop
//   6. CSS box-shadow on .app-shell provides the window drop-shadow
//   7. A custom titlebar component provides drag + minimize/maximize/close
//
// Platform notes:
//   - Windows 10: No native rounded window API; transparency + CSS does the work
//   - Windows 11: Has DWM corner rounding, but we use DONOTROUND to avoid
//     double-rounding (OS corners + CSS corners would conflict)
//   - The setup hook applies Win32 DWM attributes when available

#[cfg(target_os = "windows")]
fn configure_window(window: &tauri::WebviewWindow) {
    use windows::Win32::Foundation::HWND;
    use windows::Win32::Graphics::Dwm::{
        DwmSetWindowAttribute, DWMWA_WINDOW_CORNER_PREFERENCE, DWMWCP_DONOTROUND,
    };

    let hwnd = HWND(window.hwnd().unwrap().0 as *mut _);

    // Tell Windows 11+ not to apply its own rounded corners —
    // our CSS border-radius handles rounding against a transparent backdrop.
    // On Windows 10 this call is a harmless no-op (attribute doesn't exist).
    let preference = DWMWCP_DONOTROUND.0 as u32;
    unsafe {
        let _ = DwmSetWindowAttribute(
            hwnd,
            DWMWA_WINDOW_CORNER_PREFERENCE,
            &preference as *const u32 as *const _,
            std::mem::size_of::<u32>() as u32,
        );
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    use tauri::Manager;

    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .setup(|app| {
            if let Some(window) = app.get_webview_window("main") {
                #[cfg(target_os = "windows")]
                configure_window(&window);
                let _ = window.maximize();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
