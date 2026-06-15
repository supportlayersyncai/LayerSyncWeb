import type { Config } from "tailwindcss";

// all in fixtures is set to tailwind v3 as interims solutions

// LayerSync brand colour ramps (orange = primary, green = secondary).
const brandOrange = {
  50: "#FCF1EC", 100: "#F8DDD1", 200: "#F0B89F", 300: "#E5926E",
  400: "#DC7A4F", 500: "#D36135", 600: "#BC4F28", 700: "#973D20",
  800: "#79331C", 900: "#632C1B", 950: "#35140A",
};
const brandGreen = {
  50: "#F2F7EE", 100: "#E2EED8", 200: "#C7DDB4", 300: "#A6C98A",
  400: "#92BD74", 500: "#7FB069", 600: "#649551", 700: "#4E7641",
  800: "#405E37", 900: "#374E30", 950: "#1B2916",
};

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
  	extend: {
  		colors: {
  			// ===== LayerSync brand palette =====
  			// Warm/primary -> orange #D36135 ; cool/secondary -> green #7FB069.
  			// Legacy palette names are remapped so existing utility classes
  			// resolve to the new brand without any markup changes.
  			brand: { orange: '#D36135', green: '#7FB069', DEFAULT: '#D36135' },
  			blue: brandOrange, indigo: brandOrange, violet: brandOrange,
  			purple: brandOrange, fuchsia: brandOrange, pink: brandOrange,
  			sky: brandGreen, cyan: brandGreen, teal: brandGreen,
  			emerald: brandGreen, green: brandGreen,
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			'dark-text': {
  				primary: 'hsl(var(--dark-text-primary))',
  				secondary: 'hsl(var(--dark-text-secondary))',
  				tertiary: 'hsl(var(--dark-text-tertiary))'
  			},
  			'dark-brand': {
  				wordmark: 'hsl(var(--dark-brand-wordmark))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
