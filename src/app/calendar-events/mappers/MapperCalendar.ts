import { EventInput } from "@fullcalendar/core";
import { CalendarEvent } from "../../shared/events/calendar.event.interface";

export class MapperCalendar {
  
  public static ToMulitpleEventInputs( events: CalendarEvent[] ): EventInput[] {
    return events.map( event => this.ToSingleEventInput( event ) );
  }

  public static ToSingleEventInput( event: CalendarEvent ): EventInput {
    const { title = '', start_date = '', end_date = '', color = '' } = event;
    return {
      title,
      start: start_date,
      end: end_date,
      color: 'blue'
    }
  }
}
