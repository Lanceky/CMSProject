import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './MyCalendar.css';
import axios from 'axios';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  description?: string;
}

interface NewEvent {
  title: string;
  date: Date;
  description: string;
}

const MyCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [newEvent, setNewEvent] = useState<NewEvent>({ 
    title: '', 
    date: new Date(),
    description: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from the database
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<CalendarEvent[]>('http://localhost/api/get_events.php');
        const formattedEvents = response.data.map(event => ({
          ...event,
          id: event.id.toString()
        }));
        setEvents(formattedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again.');
        // Fallback data for development
        setEvents([
          {
            id: '1',
            title: 'Sample Event',
            date: new Date().toISOString().split('T')[0],
            description: 'This is a sample event'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setNewEvent(prev => ({
        ...prev,
        date
      }));
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title.trim()) {
      setError('Please enter a title for the milestone');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        title: newEvent.title.trim(),
        date: newEvent.date.toISOString().split('T')[0],
        description: newEvent.description.trim()
      };

      const response = await axios.post<{id: number}>(
        'http://localhost/api/create_event.php',
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const newEventWithId = {
        ...payload,
        id: response.data.id.toString()
      };

      setEvents(prev => [...prev, newEventWithId]);
      setNewEvent({ 
        title: '', 
        date: new Date(),
        description: '' 
      });
    } catch (err) {
      console.error('Error adding event:', err);
      setError('Failed to add milestone. Please try again.');
      
      // Fallback for development
      const tempId = Math.max(...events.map(e => parseInt(e.id)), 0) + 1;
      setEvents(prev => [...prev, {
        ...newEvent,
        id: tempId.toString(),
        date: newEvent.date.toISOString().split('T')[0]
      }]);
      setNewEvent({ 
        title: '', 
        date: new Date(),
        description: '' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventSelect = (info: any) => {
    const event = events.find(e => e.id === info.event.id);
    if (event) {
      alert(
        `Event: ${event.title}\n` +
        `Date: ${event.date}\n` +
        `Description: ${event.description || 'No description'}`
      );
    }
  };

  return (
    <div className="calendar-container">
      {/* Left Panel: Calendar */}
      <div className="calendar-left">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventSelect}
          height="100%"
        />
      </div>

      {/* Right Panel: Milestones Controls */}
      <div className="calendar-right">
        <h3 className="section-title">Manage Milestones</h3>
        
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)} className="dismiss-error">
              ×
            </button>
          </div>
        )}

        <div className="controls">
          <div className="control-item">
            <label>Milestone Title *</label>
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              placeholder="Enter milestone title"
              disabled={isLoading}
            />
          </div>
          <div className="control-item">
            <label>Date *</label>
            <DatePicker
              selected={newEvent.date}
              onChange={handleDateChange}
              className="datepicker-input"
              placeholderText="Select a date"
              disabled={isLoading}
            />
          </div>
          <div className="control-item">
            <label>Description</label>
            <textarea
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              placeholder="Add a description"
              disabled={isLoading}
              rows={3}
            />
          </div>
          <button 
            className="add-event-btn" 
            onClick={handleAddEvent}
            disabled={isLoading || !newEvent.title.trim()}
          >
            {isLoading ? 'Adding...' : 'Add Milestone'}
          </button>
        </div>

        <h4 className="section-title">Upcoming Milestones</h4>
        {isLoading && !events.length ? (
          <div className="loading-message">Loading milestones...</div>
        ) : events.length === 0 ? (
          <div className="no-events">No upcoming milestones</div>
        ) : (
          <ul className="events-list">
            {events
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map(event => (
                <li key={event.id} className="event-item">
                  <div className="event-date">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="event-content">
                    <div className="event-title">{event.title}</div>
                    {event.description && (
                      <div className="event-description">{event.description}</div>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyCalendar;