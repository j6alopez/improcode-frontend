export interface DateClickInfo {
  date: string;
  dateStr: string;
  allDay: boolean;
  dayEl: DayEl;
  jsEvent: JSEvent;
  view: View;
}

export interface DayEl {
}

export interface JSEvent {
  isTrusted: boolean;
}

export interface View {
  type: string;
  dateEnv: DateEnv;
}

export interface DateEnv {
  timeZone: string;
  canComputeOffset: boolean;
  calendarSystem: DayEl;
  locale: Locale;
  weekDow: number;
  weekDoy: number;
  weekText: string;
  weekTextLong: string;
  cmdFormatter: null;
  defaultSeparator: string;
}

export interface Locale {
  codeArg: string;
  codes: string[];
  week: Week;
  options: Options;
}

export interface Options {
  direction: string;
  buttonText: ButtonText;
  weekText: string;
  weekTextLong: string;
  closeHint: string;
  timeHint: string;
  eventHint: string;
  allDayText: string;
  moreLinkText: string;
  noEventsText: string;
  buttonHints: ButtonHints;
  viewHint: string;
  navLinkHint: string;
}

export interface ButtonHints {
  prev: string;
  next: string;
}

export interface ButtonText {
  prev: string;
  next: string;
  prevYear: string;
  nextYear: string;
  year: string;
  today: string;
  month: string;
  week: string;
  day: string;
  list: string;
}

export interface Week {
  dow: number;
  doy: number;
}
