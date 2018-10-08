import getMonth from 'date-fns/get_month';
import getYear from 'date-fns/get_year';
import addMonths from 'date-fns/add_months';

export default class ReportingPeriod {
  constructor() {
    const today = new Date();
    const currentMonth = getMonth(today);
    const currentYear = getYear(today);
    const period = Math.floor(currentMonth / 4);
    this.start = new Date(currentYear, period * 4, 1);
    this.end = addMonths(this.start, 4);
  }
}
