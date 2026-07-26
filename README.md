# CrazyFeb E-Commerce Platform

A React + TypeScript + Vite + Firebase e-commerce web application.

## Security Note on Mock Auth Mode

> [!WARNING]
> **Mock Auth Mode Limitations**:
> When Firebase environment variables are not configured, the application falls back to **mock-auth mode**.
> In mock-auth mode, user account details and passwords are saved in plain text within browser `localStorage` (`crazyfeb_mock_users`).
> This fallback is intended **strictly for local development and demo testing only**. Never use mock-auth mode in a production environment. For production, ensure proper Firebase project environment variables (`VITE_FIREBASE_API_KEY`, etc.) are configured.

