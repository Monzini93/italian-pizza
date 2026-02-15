// Paleta baseada no logo Italian Pizza: marrom, vermelho e verde da bandeira, dourado da crosta, pêssego
tailwind.config = {
  theme: {
    extend: {
      fontFamily: { sans: ['Outfit', 'system-ui', 'sans-serif'], display: ['Playfair Display', 'serif'] },
      colors: {
        italian: {
          red: '#DE332E',
          'red-dark': '#c42a26',
          green: '#008C45',
          'green-dark': '#006b38',
          brown: '#612F1F',
          'brown-light': '#7C422A',
          gold: '#E3A85B',
          'gold-light': '#FFDBB8'
        }
      }
    }
  }
};
