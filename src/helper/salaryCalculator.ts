import moment from 'moment';

 // Function to get total working days (Monday-Friday) in a month
 function getWorkingDaysInMonth(startDate: Date,endDate:Date): number {
    const start = moment(startDate).startOf('day');
    const end = moment(endDate).endOf('day');
    let workingDays = 0;

  const currentDate = start.clone();

  while (currentDate.isSameOrBefore(end)) {
    // 1 = Monday, 5 = Friday
    if (currentDate.isoWeekday() <= 5) {
      workingDays++;
    }
    currentDate.add(1, 'day');
  }

  return workingDays;
  }

// Bonus: Calculate working days between two dates
 function getWorkingDaysBetween(start: Date, end: Date): number {
  let workingDays = 0;
  const current = moment(start);
  const endMoment = moment(end);

  while (current.isSameOrBefore(endMoment)) {
    if (current.isoWeekday() <= 5) {
      workingDays++;
    }
    current.add(1, 'day');
  }

  return workingDays;
}


export { getWorkingDaysInMonth, getWorkingDaysBetween };