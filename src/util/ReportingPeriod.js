import getMonth from 'date-fns/get_month';
import getYear from 'date-fns/get_year';
import addMonths from 'date-fns/add_months';
import subDays from 'date-fns/sub_days';
import differenceInDays from 'date-fns/difference_in_days';
import Copy from 'src/assets/Copy';

const TARGET_IMAGE_COUNT = 16;

export const ReportingPeriodStatus = {
  AHEAD: { threshold: 2, color: '#009933', label: Copy.reportingPeriodStatusAhead, icon: 'grin-beam' },
  ONTRACK: { threshold: -1, color: '#07bb8f', label: Copy.reportingPeriodStatusOnTrack, icon: 'smile' },
  BEHIND: { threshold: -3, color: '#ff6633', label: Copy.reportingPeriodStatusBehind, icon: 'frown' },
  WARNING: {
    threshold: -(TARGET_IMAGE_COUNT + 1),
    color: '#cc3333',
    label: Copy.reportingPeriodStatusWarning,
    icon: 'surprise',
  },
};

export default class ReportingPeriod {
  constructor() {
    this.targetImageCount = TARGET_IMAGE_COUNT;
    this.today = new Date();
    const currentMonth = getMonth(this.today);
    const currentYear = getYear(this.today);
    const period = Math.floor(currentMonth / 4);
    this.start = new Date(currentYear, period * 4, 1);
    this.end = subDays(addMonths(this.start, 4), 1);

    this.daysElapsed = differenceInDays(this.today, this.start);
    const startToEnd = differenceInDays(this.end, this.start);
    this.daysLeft = differenceInDays(this.end, this.today);
    this.percentageComplete = (100 * this.daysElapsed) / startToEnd;
    this.proRataTargetImageCount = this.targetImageCount * (this.daysElapsed / startToEnd);
  }

  getStatus(totalApproved) {
    const diff = totalApproved - this.proRataTargetImageCount;

    if (diff >= ReportingPeriodStatus.AHEAD.threshold) {
      return ReportingPeriodStatus.AHEAD;
    }
    if (diff >= ReportingPeriodStatus.ONTRACK.threshold) {
      return ReportingPeriodStatus.ONTRACK;
    }
    if (diff >= ReportingPeriodStatus.BEHIND.threshold) {
      return ReportingPeriodStatus.BEHIND;
    }
    return ReportingPeriodStatus.WARNING;
  }

  test() {
    for (let i = 0; i < this.targetImageCount + 1; i += 1) {
      console.log(`${this.percentageComplete}% complete, ${i} photos. Status = ${this.getStatus(i)}`);
    }
  }
}
