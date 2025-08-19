// French number to words conversion
const unites = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
const dizaines = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];
const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];

function convertHundreds(num: number): string {
  let result = '';
  
  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;
  
  if (hundreds > 0) {
    if (hundreds === 1) {
      result += 'cent';
    } else {
      result += unites[hundreds] + ' cent';
    }
    if (hundreds > 1 && remainder === 0) {
      result += 's';
    }
    if (remainder > 0) {
      result += ' ';
    }
  }
  
  if (remainder >= 10 && remainder < 20) {
    result += teens[remainder - 10];
  } else {
    const tens = Math.floor(remainder / 10);
    const units = remainder % 10;
    
    if (tens === 7) {
      result += 'soixante';
      if (units > 0) {
        result += '-' + teens[units];
      } else {
        result += '-dix';
      }
    } else if (tens === 9) {
      result += 'quatre-vingt';
      if (units > 0) {
        result += '-' + teens[units];
      } else {
        result += '-dix';
      }
    } else {
      if (tens > 0) {
        result += dizaines[tens];
        if (tens === 8 && units === 0) {
          result += 's';
        }
      }
      
      if (units > 0) {
        if (tens > 0 && tens !== 8) {
          result += '-';
        } else if (tens === 8) {
          result += '-';
        }
        
        if (units === 1 && tens === 2) {
          result += 'et-un';
        } else if (units === 1 && (tens === 3 || tens === 4 || tens === 5 || tens === 6)) {
          result += 'et-un';
        } else {
          result += unites[units];
        }
      }
    }
  }
  
  return result;
}

export function numberToFrenchWords(amount: number): string {
  if (amount === 0) return 'zéro';
  
  const euros = Math.floor(amount);
  const centimes = Math.round((amount - euros) * 100);
  
  let result = '';
  
  if (euros === 0) {
    result = 'zéro';
  } else if (euros === 1) {
    result = 'un';
  } else if (euros < 1000) {
    result = convertHundreds(euros);
  } else if (euros < 1000000) {
    const thousands = Math.floor(euros / 1000);
    const remainder = euros % 1000;
    
    if (thousands === 1) {
      result = 'mille';
    } else {
      result = convertHundreds(thousands) + ' mille';
    }
    
    if (remainder > 0) {
      result += ' ' + convertHundreds(remainder);
    }
  } else {
    const millions = Math.floor(euros / 1000000);
    const remainder = euros % 1000000;
    
    if (millions === 1) {
      result = 'un million';
    } else {
      result = convertHundreds(millions) + ' millions';
    }
    
    if (remainder >= 1000) {
      const thousands = Math.floor(remainder / 1000);
      const lastRemainder = remainder % 1000;
      
      if (thousands === 1) {
        result += ' mille';
      } else {
        result += ' ' + convertHundreds(thousands) + ' mille';
      }
      
      if (lastRemainder > 0) {
        result += ' ' + convertHundreds(lastRemainder);
      }
    } else if (remainder > 0) {
      result += ' ' + convertHundreds(remainder);
    }
  }
  
  if (centimes > 0) {
    result += ' et ';
    if (centimes === 1) {
      result += 'un centime';
    } else {
      result += convertHundreds(centimes) + ' centimes';
    }
  }
  
  return result.charAt(0).toUpperCase() + result.slice(1);
}