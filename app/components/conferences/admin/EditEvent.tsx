import { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  Form,
  InputGroup,
  Toast,
} from 'react-bootstrap';
import Cookies from 'js-cookie';
import { EventForm } from '../eventForm';
import { useRouter } from 'next/router';
import {
  editEvent,
  getTicketDetails,
  editEventTicket,
} from '../../../lib/conferences/eventCall';
import styles from '../../../styles/event.module.css';
import toast, { Toaster } from 'react-hot-toast';

export const EditEvent = ({ event, handleToast }) => {
  const [formState, setFormState] = useState({
    name: event.data.name,
    description: event.data.description,
    starts_at: event.data['starts_at'].slice(0, 16),
    ends_at: event.data['ends_at'].slice(0, 16),
    original_image_url: event.data['original_image_url'],
    logo_url: event.data['logo_url'],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    online: true,
    is_sessions_speakers_enabled: true,
    privacy: event.data.privacy,
  });

  const [publish, setPublish] = useState('published');
  const [isPublic, setIsPublic] = useState(
    event.data.privacy === 'public' ? true : false
  );

  const [ticket, setTicket] = useState({
    name: 'Registration',
    state: true,
    quantity: 1,
  });

  const router = useRouter();

  useEffect(() => {
    const ticketInfo = async () => {
      try {
        let token = Cookies.get('event_auth');
        token
          ? (token = JSON.parse(token).access_token)
          : new Error('Please, Sign in again');

        const res = await getTicketDetails(
          event.data.relationships.tickets.data[0].id,
          token
        );

        setTicket({
          name: res.data.name,
          state: res.data.type === 'free',
          quantity: res.data.quantity,
        });
      } catch (e) {
        console.error('An error occurred while fetching tickets', e);
      }
    };
    ticketInfo();
  }, []);

  const handleTicketUpdate = async (eid, auth) => {
    const tdata = {
      data: {
        attributes: {
          name: ticket.name,
          'sales-starts_at': new Date(formState['starts_at']).toISOString(),
          'sales-ends_at': new Date(formState['ends_at']).toISOString(),
          quantity: ticket.quantity,
          type: ticket.state ? 'free' : 'freeRegistration',
          'min-order': 1,
          'max-order': 1,
          'is-description-visible': true,
        },
        type: 'ticket',
        id: eid,
      },
    };

    const tickRes = await editEventTicket(eid, tdata, auth);
    return tickRes;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (formState['logo_url'] === '') {
      delete formState['logo_url'];
    }

    const data = {
      data: {
        attributes: {
          ...formState,
          state: publish,
          privacy: isPublic ? 'public' : 'private',
        },
        id: event.data.id,
        type: 'event',
      },
    };

    try {
      let token = Cookies.get('event_auth');
      token
        ? (token = JSON.parse(token).access_token)
        : new Error('Please, Sign in again');

      const res = await editEvent(data, token, event.data.identifier);
      toast.success('Event updated');
      const tres = handleTicketUpdate(
        event.data.relationships.tickets.data[0].id,
        token
      );

      sessionStorage.setItem('event', JSON.stringify(res.data));

      router.push('/conferences/admin/dashboard');
    } catch (e) {
      console.error('Event Update failed', e.response.data.error);
      if (e.response.status == 401) {
        Cookies.remove('event_auth');
        router.push('/conferences');
      }
    }
  };

  const handleSwitch = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    name === 'switch'
      ? setTicket((prev) => ({
          ...prev,
          state: !ticket.state,
        }))
      : setTicket((prev) => ({
          ...prev,
          [name]: value,
        }));
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePublicSwitch = (e) => {
    const checked = e.target.checked;
    setIsPublic(checked);
  };

  const handleImageChange = (e) => {
    // Handle image change logic here
    const file = e.target.files?.[0];
    if (file) {
      // Add your image handling logic
      console.log('Image selected:', file);
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Card>
        <Card.Body>
          <Form onSubmit={handleFormSubmit}>
            <EventForm
              isPublic={isPublic}
              intialValues={formState}
              handleChange={handleChange}
              handleImageChange={handleImageChange}
              ticket={ticket}
              handleSwitch={handleSwitch}
              handlePublicSwitch={handlePublicSwitch}
            />
            <ButtonGroup aria-label="Basic example">
              <Button variant="primary" type="submit">
                Save
              </Button>
            </ButtonGroup>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export const CustomToast = ({ show, type, msg }) => {
  return (
    <Toast show={show} className={styles.toast} bg={type}>
      <Toast.Header>
        <strong className="me-auto">Event Alert!</strong>
      </Toast.Header>
      <Toast.Body>{msg}</Toast.Body>
    </Toast>
  );
};
