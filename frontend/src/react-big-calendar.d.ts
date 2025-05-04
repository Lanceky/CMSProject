declare module 'react-big-calendar' {
    import { ComponentType } from 'react';
  
    type Event = {
      title: string;
      start: Date;
      end: Date;
      allDay?: boolean;
      resource?: any;
    };
  
    type View = 'month' | 'week' | 'work_week' | 'day' | 'agenda';
  
    export interface CalendarProps<TEvent = Event, TResource = any> {
      localizer: any;
      events?: TEvent[];
      startAccessor?: keyof TEvent | ((event: TEvent) => Date);
      endAccessor?: keyof TEvent | ((event: TEvent) => Date);
      allDayAccessor?: keyof TEvent | ((event: TEvent) => boolean);
      titleAccessor?: keyof TEvent | ((event: TEvent) => string);
      resourceAccessor?: keyof TEvent | ((event: TEvent) => TResource);
      defaultView?: View;
      views?: View[];
      step?: number;
      timeslots?: number;
      style?: React.CSSProperties;
      className?: string;
      onSelectEvent?: (event: TEvent, e: React.SyntheticEvent) => void;
      onDoubleClickEvent?: (event: TEvent, e: React.SyntheticEvent) => void;
      onSelectSlot?: (slotInfo: {
        start: Date;
        end: Date;
        slots: Date[];
        action: 'select' | 'click' | 'doubleClick';
      }) => void;
      onNavigate?: (newDate: Date, view: View, action: string) => void;
      onView?: (view: View) => void;
    }
  
    const Calendar: ComponentType<CalendarProps>;
    export default Calendar;
  }
  