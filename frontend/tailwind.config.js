/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			DEFAULT: 'axiforma',
  			axiforma: 'axiforma',
			playfair: 'Playfair Display'
  		},
		letterSpacing: {
			"heading": "-0.03em"
		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))'
  			},
  			neutral: {
  				'100': 'hsl(var(--neutral-100))',
  				'200': 'hsl(var(--neutral-200))',
  				'300': 'hsl(var(--neutral-300))',
  				'400': 'hsl(var(--neutral-400))',
  				'500': 'hsl(var(--neutral-500))',
  				'600': 'hsl(var(--neutral-600))',
  				DEFAULT: 'hsl(var(--neutral-100))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))'
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
  			}
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
  plugins: [require('tailwindcss-animate')]
}
