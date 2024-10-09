
export const numberWithCommas = (input: string | number) => {
    const number = typeof input === 'string' ? parseFloat(input.replace(/,/g, '')) : Number(input);
    return number.toLocaleString('en-US');
};

export const checkIfEmpty = (input: string | number) => {
    if (input === 0 || input === "0" || input === "" || input === "0 sf") {
      return "-";
    } else {
      return input;
    }
};

export const formatDate = (inputDate: string) => {
    if(!inputDate) return 'N/A';
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const [year, month, day] = inputDate.split('-').map(Number);
  
    return `${day} ${months[month - 1]}, ${year}`;
}; 

export function getGarageSituation(availableParking: string): string {
    let answer: string = "Other";
  
    // Valid answers: Triple, Double, Single, Carpot, Open, Parking Available, Other, Underground
    try {
      const rank: string[] = ['Triple', 'Double', 'Single', 'Carpot', 'Open', 'Parking Available', 'Underground'];
  
      const parkingArray: string[] = availableParking.split(',');
  
      for (const parkingType of rank) {
        for (const word of parkingArray) {
          if (word.includes(parkingType)) {
            answer = parkingType;
            return answer;
          }
        }
      }
    } catch (error) {
    }
  
    return answer;
}

export function getBathrooms(FULL_BATH: string, HALF_BATH: string): string | number {
    const halfBathExists = Boolean(HALF_BATH.trim().replace("-", ""));
    const fullBathExists = Boolean(FULL_BATH.trim().replace("-", ""));
  
    const halfBathCount = halfBathExists ? parseInt(HALF_BATH) : 0;
    const fullBathCount = fullBathExists ? parseInt(FULL_BATH) : 0;
  
    if (fullBathCount || halfBathCount) {
        return fullBathCount + (halfBathCount * 0.5);
    } else {
        return '−';
    }
}

export const formatTax = (inputTax: string) => {
    const [number, info] = inputTax.split(" ");
    const roundedNumber = Math.round(parseFloat(number) * 100) / 100;
    return `${roundedNumber.toFixed(2)} ${info}`;
}