import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  Container,
  Image,
  OverlayTrigger,
  Row,
  Stack,
  Tab,
  Table,
  Tabs,
  Tooltip,
} from 'react-bootstrap';
import styles from '../styles/index.module.css';

import { MdEventSpeaker, SmEventSpeaker } from './EventSpeaker';
import { MdEventHeader, SmEventHeader } from './EventHeader';

import { BsYoutube } from 'react-icons/bs';
import useMediaQuery from '../../useMediaQuery';

const TAB_OPTIONS = ['home', 'sessions', 'speakers'];

const EventShow = ({ event, error, speaker, prsession, customLink }) => {
  const [activeKey, setActiveKey] = useState('home');
  const [expandedSessions, setExpandedSessions] = useState({});

  const isSmallScreen = useMediaQuery('(max-width: 576px)');

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (TAB_OPTIONS.includes(hash)) {
      setActiveKey(hash);
    }
  }, []);

  const toggleSessionExpansion = useCallback((sessionId) => {
    setExpandedSessions((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }));
  }, []);

  if (error) {
    return <div>Error loading event data</div>;
  }

  return (
    <>
      <MdEventHeader event={event} error={error} customLink={customLink} />
      <SmEventHeader event={event} error={error} customLink={customLink} />
      <Card className={styles.event_show_root}>
        <div className={styles.event_nav}>
          <Tabs
            id="event-tabs"
            activeKey={activeKey}
            onSelect={setActiveKey}
            className={styles.event_nav_header}
            fill
          >
            <Tab eventKey="home" title="Overview">
              <EventOverview event={event} />
            </Tab>
            {prsession && (
              <Tab eventKey="sessions" title="Sessions">
                <EventSession
                  session={prsession[0]}
                  expandedSessions={expandedSessions}
                  onToggleExpansion={toggleSessionExpansion}
                />
              </Tab>
            )}
            <Tab eventKey="speakers" title="Speakers">
              {activeKey === 'speakers' &&
                (isSmallScreen ? (
                  <SmEventSpeaker
                    eid={event?.data?.identifier}
                    speaker={speaker}
                  />
                ) : (
                  <MdEventSpeaker
                    eid={event?.data?.identifier}
                    speaker={speaker}
                  />
                ))}
            </Tab>
          </Tabs>
        </div>
      </Card>
    </>
  );
};

const EventOverview = ({ event }) => (
  <Stack>
    <EventDescription eventData={event?.data} />
    {event?.data?.logo_url && (
      <div className={styles.event_logo}>
        <Image src={event.data.logo_url} width={100} alt="Event Logo" />
      </div>
    )}
    <div className={styles.event_organizer_header}>
      <h6>Organizer</h6>
    </div>
  </Stack>
);

const EventDescription = ({ eventData }) => {
  if (!eventData?.description) {
    return <div>No description available</div>;
  }

  return (
    <Container className={styles.event_desc}>
      <Row>
        <Col>
          <div>
            <h6>About the Event</h6>
            <div dangerouslySetInnerHTML={{ __html: eventData.description }} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const EventSession = ({ session, expandedSessions, onToggleExpansion }) => {
  // Configuration for core table columns (always show if available)
  const CORE_COLUMN_CONFIG = {
    Start: {
      label: 'Start Time',
      formatter: formatTime,
      priority: 1,
    },
    End: {
      label: 'End Time',
      formatter: formatTime,
      priority: 2,
    },
    Title: {
      label: 'Session Title',
      formatter: (value) => value || 'Untitled',
      priority: 3,
    },
    Speaker: {
      label: 'Speaker',
      formatter: (value) => value || 'TBD',
      priority: 4,
    },
    Duration: {
      label: 'Duration',
      formatter: (value) => (value ? `${value} min` : 'N/A'),
      priority: 5,
    },
    Youtube: {
      label: 'Recording',
      formatter: null, // Special handling
      priority: 6,
    },
  };

  // Fields that should never be shown in table or details
  const SYSTEM_FIELDS = ['id', 'createdAt', 'updatedAt', 'Event', 'uniqueId'];

  // Fields that should be shown in the collapsible details section
  const DETAIL_FIELDS = [
    'Description',
    'Mentor',
    'Notes',
    'Location',
    'Room',
    'Track',
    'Category',
    'Abstract',
    'Requirements',
  ];

  const sessionItems = useMemo(() => {
    const items = Array.isArray(session?.session_items)
      ? session.session_items
      : [];
    return items.map((item, index) => ({
      ...item,
      uniqueId:
        item.id ||
        `session-${index}-${item.Title || 'untitled'}-${
          item.Start || 'no-time'
        }`,
    }));
  }, [session]);

  const { tableColumns, hasDetailsForAnySession } = useMemo(() => {
    if (sessionItems.length === 0)
      return { tableColumns: [], hasDetailsForAnySession: false };

    // Get all available fields from the data
    const allFields = new Set();
    sessionItems.forEach((item) => {
      Object.keys(item).forEach((key) => allFields.add(key));
    });

    // Filter and sort table columns
    const columns = Array.from(allFields)
      .filter((key) => !SYSTEM_FIELDS.includes(key))
      .filter((key) => !DETAIL_FIELDS.includes(key))
      .filter((key) => CORE_COLUMN_CONFIG[key]) // Only show configured columns
      .sort((a, b) => {
        const priorityA = CORE_COLUMN_CONFIG[a]?.priority || 999;
        const priorityB = CORE_COLUMN_CONFIG[b]?.priority || 999;
        return priorityA - priorityB;
      });

    // Check if any session has details worth showing
    const hasDetails = sessionItems.some((item) =>
      DETAIL_FIELDS.some(
        (field) => item[field] && String(item[field]).trim() !== ''
      )
    );

    return { tableColumns: columns, hasDetailsForAnySession: hasDetails };
  }, [sessionItems]);

  if (sessionItems.length === 0) {
    return (
      <Container>
        <div className="text-center py-4">
          <p>No sessions available for this event.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container style={{ maxWidth: '99vw' }}>
      <Table responsive striped hover>
        <thead>
          <tr>
            {hasDetailsForAnySession && <th style={{ width: '50px' }}></th>}
            {tableColumns.map((column) => (
              <th key={column}>
                {CORE_COLUMN_CONFIG[column]?.label || column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sessionItems.map((sessionItem, index) => (
            <SessionRow
              key={sessionItem.uniqueId}
              session={sessionItem}
              columns={tableColumns}
              columnConfig={CORE_COLUMN_CONFIG}
              detailFields={DETAIL_FIELDS}
              isExpanded={expandedSessions[sessionItem.uniqueId] || false}
              onToggle={onToggleExpansion}
              showExpandButton={hasDetailsForAnySession}
              rowNumber={index + 1}
            />
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

const SessionRow = ({
  session,
  columns,
  columnConfig,
  detailFields,
  isExpanded,
  onToggle,
  showExpandButton,
  rowNumber,
}) => {
  const handleToggle = useCallback(() => {
    onToggle(session.uniqueId);
  }, [session.uniqueId, onToggle]);

  const renderCellValue = (column, value) => {
    if (column === 'Youtube') {
      const hasRecording = value && value.trim() !== '';

      const tooltip = (
        <Tooltip id={`youtube-tooltip-${session.uniqueId}`}>
          {hasRecording ? 'Watch Recording' : 'Recording Coming Soon'}
        </Tooltip>
      );

      return (
        <div className="d-flex justify-content-center">
          <OverlayTrigger placement="top" overlay={tooltip}>
            {hasRecording ? (
              <Button
                variant="link"
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="p-0 d-flex align-items-center"
                style={{ textDecoration: 'none' }}
              >
                <BsYoutube color="#FF0000" size={24} />
              </Button>
            ) : (
              <span
                className="d-flex align-items-center"
                style={{ cursor: 'default' }}
              >
                <BsYoutube color="#6c757d" size={24} />
              </span>
            )}
          </OverlayTrigger>
        </div>
      );
    }

    const formatter = columnConfig[column]?.formatter;
    return formatter ? formatter(value) : value || 'N/A';
  };

  // Get all detail fields that have values for this session
  const sessionDetails = detailFields
    .map((field) => ({
      field,
      value: session[field],
      label: field.charAt(0).toUpperCase() + field.slice(1),
    }))
    .filter((detail) => detail.value && String(detail.value).trim() !== '');

  const hasSessionDetails = sessionDetails.length > 0;

  return (
    <>
      <tr>
        {showExpandButton && (
          <td>
            {hasSessionDetails && (
              <Badge
                bg="light"
                text="dark"
                role="button"
                onClick={handleToggle}
                className={styles.session_expand}
                aria-label={isExpanded ? 'Collapse session' : 'Expand session'}
                style={{ cursor: 'pointer' }}
              >
                {isExpanded ? '▼' : '▶'}
              </Badge>
            )}
          </td>
        )}
        {columns.map((column) => (
          <td key={column}>{renderCellValue(column, session[column])}</td>
        ))}
      </tr>
      {hasSessionDetails && (
        <tr>
          <td
            colSpan={columns.length + (showExpandButton ? 1 : 0)}
            className="p-0"
          >
            <Collapse in={isExpanded}>
              <div className="p-3 bg-light border-top">
                <div className="row">
                  {sessionDetails.map(({ field, value, label }) => (
                    <div key={field} className="col-md-6 mb-2">
                      <strong>{label}:</strong>
                      <div className="mt-1">
                        {field === 'Description' ? (
                          <div dangerouslySetInnerHTML={{ __html: value }} />
                        ) : (
                          <span>{value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Collapse>
          </td>
        </tr>
      )}
    </>
  );
};

// Utility function for time formatting
function formatTime(timeString) {
  if (!timeString) return 'N/A';

  try {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return timeString; // Return original if parsing fails
  }
}

export default EventShow;
