export function getAgeInMonth(dob: string): string {
  const today = new Date();
  const birthDate = new Date(dob);

  let ageYears = today.getFullYear() - birthDate.getFullYear();
  let ageMonths = today.getMonth() - birthDate.getMonth();

  if (ageMonths < 0) {
    ageYears--;
    ageMonths += 12;
  }

  return ageYears * 12 + ageMonths + 'M';
}
