export function openSidebar() {
  if (typeof window !== 'undefined') {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.setProperty('--SideNavigation-slideIn', '1');
  }
}

export function closeSidebar() {
  if (typeof window !== 'undefined') {
    document.documentElement.style.removeProperty('--SideNavigation-slideIn');
    document.body.style.removeProperty('overflow');
  }
}

export function toggleSidebar() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--SideNavigation-slideIn');
    if (slideIn) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
}

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

export function formatTimeTo12HourFormat(dateString: string | null) {
  if (dateString === null) {
    return '';
  }

  const date = new Date(dateString);

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const period = hours < 12 ? 'AM' : 'PM';

  const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;
  return formattedTime;
}
