/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['DM Sans', 'sans-serif'],
                mono: ['IBM Plex Mono', 'monospace'],
            },
            colors: {
                background: 'hsl(var(--background))',
                surface: 'hsl(var(--surface))',
                'surface-elevated': 'hsl(var(--surface-elevated))',
                border: 'hsl(var(--border))',
                'border-subtle': 'hsl(var(--border-subtle))',
                primary: 'hsl(var(--primary))',
                accent: 'hsl(var(--accent))',
                muted: 'hsl(var(--muted))',
                foreground: 'hsl(var(--foreground))',
                'foreground-muted': 'hsl(var(--foreground-muted))',
                success: 'hsl(var(--success))',
                danger: 'hsl(var(--danger))',
                warning: 'hsl(var(--warning))',
                card: 'hsl(var(--card))',
            },
            borderRadius: {
                DEFAULT: '8px',
                lg: '12px',
                xl: '16px',
                '2xl': '20px',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
};