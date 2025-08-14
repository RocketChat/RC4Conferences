import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Badge,
  Button,
  Col,
  Container,
  Row,
  ButtonGroup,
} from 'react-bootstrap';
import { GoLocation } from 'react-icons/go';
import { BiCalendarPlus } from 'react-icons/bi';
import { atcb_action } from 'add-to-calendar-button';
import styles from '../styles/index.module.css';

// Constants
const DEFAULT_CALENDAR_OPTIONS = [
  'Apple',
  'Google',
  'iCal',
  'Microsoft365',
  'MicrosoftTeams',
  'Outlook.com',
  'Yahoo',
];

const DATE_FORMAT_OPTIONS = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
};

// Utility functions
const formatEventDateTime = (dateString, timezone) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-US', {
    ...DATE_FORMAT_OPTIONS,
    timeZone: timezone,
  });
};

// Email validation helper
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Format organizer according to schema requirements
const formatOrganizer = (event) => {
  const name = event?.owner_name || event?.organizer || 'Event Organizer';
  const email =
    event?.owner_email || event?.organizer_email || event?.contact_email;

  // If we have a valid email, use NAME|EMAIL format
  if (email && isValidEmail(email)) {
    return `${name}|${email}`;
  }

  // If no valid email, use a default format that meets the schema requirement
  return `${name}|info@example.com`;
};

// Check if device is mobile
// Check if device is mobile
const isMobileDevice = () => {
  // Check if we're in browser environment
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

const createCalendarConfig = (
  event,
  customLink,
  calendarOptions = DEFAULT_CALENDAR_OPTIONS
) => {
  const startDate = new Date(event.starts_at);
  const endDate = new Date(event.ends_at);
  const timezone = event?.timezone || 'UTC';

  // Format dates properly for the calendar library
  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const formatTime = (date, tz) => {
    // Convert to the event's timezone and get HH:MM format
    const timeString = date.toLocaleString('en-CA', {
      timeZone: tz,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
    return timeString.split(', ')[1] || timeString; // Extract time part
  };

  const config = {
    name: event?.name || 'Event',
    description: event?.description || '',
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    startTime: formatTime(startDate, timezone),
    endTime: formatTime(endDate, timezone),
    timeZone: timezone,
    organizer: formatOrganizer(event),
    location: customLink || 'Online',
    options: calendarOptions,
    iCalFileName: generateICalFileName(event?.name),
    // Force web URLs on mobile to avoid app intent issues
    forceWebView: true,
    // Additional configuration to prevent mobile app redirects
    lightMode: 'bodyScheme',
    hideBackground: true,
    hideCheckmark: true,
    // Set trigger to 'click' to avoid automatic detection issues
    trigger: 'click',
  };

  // On mobile, limit to web-friendly options
  if (isMobileDevice()) {
    config.options = ['Google', 'iCal', 'Outlook.com', 'Yahoo'];
  }

  return config;
};

const generateICalFileName = (eventName) => {
  if (!eventName) return 'event';
  return eventName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

const getUserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.warn('Failed to get user timezone, falling back to UTC:', error);
    return 'UTC';
  }
};

// Alternative direct Google Calendar URL generator for fallback
const generateGoogleCalendarUrl = (event, customLink) => {
  const startDate = new Date(event.starts_at);
  const endDate = new Date(event.ends_at);

  const formatDateForGoogle = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.name || 'Event',
    dates: `${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}`,
    details: event.description || '',
    location: customLink || 'Online',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

function EventStrip({
  event,
  ticket,
  containerRef,
  customLink,
  handleJoin,
  eid,
  showMainstage = false,
  calendarOptions = DEFAULT_CALENDAR_OPTIONS,
  dateLocale = 'en-US',
  className,
  organizerEmail,
  ...props
}) {
  const [userTimezone, setUserTimezone] = useState('UTC');

  // Memoized values for better performance
  const formattedDates = useMemo(() => {
    if (!event?.starts_at || !event?.ends_at) {
      return { start: '', end: '' };
    }

    return {
      start: formatEventDateTime(event.starts_at, userTimezone),
      end: formatEventDateTime(event.ends_at, userTimezone),
    };
  }, [event?.starts_at, event?.ends_at, userTimezone]);

  const calendarConfig = useMemo(() => {
    if (!event) return {};

    // Merge organizer email if provided via props
    const eventWithEmail = organizerEmail
      ? { ...event, organizer_email: organizerEmail }
      : event;

    return createCalendarConfig(eventWithEmail, customLink, calendarOptions);
  }, [event, customLink, calendarOptions, organizerEmail]);

  const locationName = useMemo(() => {
    return event?.location_name || event?.['location-name'] || 'Online';
  }, [event?.location_name, event?.['location-name']]);

  const ticketInfo = useMemo(() => {
    return {
      name: ticket?.name || 'Community',
      price: ticket?.price ?? 'Free',
    };
  }, [ticket]);

  // Set user timezone on component mount
  useEffect(() => {
    setUserTimezone(getUserTimezone());
  }, []);

  // Callback for calendar action with error handling and fallback
  const handleCalendarAction = useCallback(() => {
    try {
      if (Object.keys(calendarConfig).length > 0) {
        console.log('Calendar config:', calendarConfig); // Debug log

        // On mobile devices, use direct Google Calendar URL as fallback
        if (isMobileDevice()) {
          const googleUrl = generateGoogleCalendarUrl(event, customLink);
          window.open(googleUrl, '_blank', 'noopener,noreferrer');
        } else {
          atcb_action(calendarConfig);
        }
      }
    } catch (error) {
      console.error('Calendar action failed:', error);

      // Fallback to direct Google Calendar URL
      try {
        const googleUrl = generateGoogleCalendarUrl(event, customLink);
        window.open(googleUrl, '_blank', 'noopener,noreferrer');
      } catch (fallbackError) {
        console.error('Fallback calendar action also failed:', fallbackError);
      }
    }
  }, [calendarConfig, event, customLink]);

  // Early return if event data is not available
  if (!event) {
    return (
      <Container
        className={`${styles.event_strip_container} ${className || ''}`}
        fluid
      >
        <div>Event data not available</div>
      </Container>
    );
  }

  return (
    <Container
      className={`${styles.event_strip_container} ${className || ''}`}
      ref={containerRef}
      fluid
      {...props}
    >
      <Row className={styles.event_strip_name}>
        <Col style={{ overflow: 'auto' }}>{event.name}</Col>
        <Col
          xs={2}
          md={1.5}
          xl={0.5}
          sm={2}
          xxl={1.5}
          className="event-join-button"
        >
          {showMainstage ? (
            <Button size="sm" onClick={handleJoin} disabled={!handleJoin}>
              Join
            </Button>
          ) : (
            <ButtonGroup>
              <Button
                size="sm"
                id="custom"
                href={customLink}
                target="_blank"
                rel="noopener noreferrer"
                disabled={!customLink}
              >
                Join
              </Button>
              <Button
                variant="light"
                size="sm"
                onClick={handleCalendarAction}
                title="Add to Calendar"
                aria-label="Add event to calendar"
              >
                <BiCalendarPlus color="#ff6a71" />
              </Button>
            </ButtonGroup>
          )}
        </Col>
      </Row>

      <hr />

      <Row className={styles.event_strip_bottom}>
        <Col sm={4} md={5} className="event-datetime">
          <Row>Time and Date ({userTimezone})</Row>
          <Row>
            {formattedDates.start && formattedDates.end
              ? `${formattedDates.start} - ${formattedDates.end}`
              : 'Date/Time not available'}
          </Row>
        </Col>

        <Col className="event-location">
          <Row className={styles.event_strip_location_row}>
            <Col xs={1} md={1} xl={1} sm={1} xxl={1}>
              <GoLocation aria-hidden="true" />
            </Col>
            <Col>Location</Col>
          </Row>
          <Row>
            <Col xs={1} md={1} xl={1} sm={1} xxl={1} />
            <Col>{locationName}</Col>
          </Row>
        </Col>

        <Col className="event-ticket-details">
          <Row>
            <Col>
              {ticketInfo.name}{' '}
              <Badge as="span" pill bg="light" text="secondary">
                {ticketInfo.price}
              </Badge>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default EventStrip;
