import { fetchEventAPI } from '../api';
import { IEvent, IForm, ISession, ISpeaker } from '../types';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const getEventDetails = async (
  eid: string
): Promise<ApiResponse<IEvent>> => fetchEventAPI(`/events/${eid}`);

export const getEventDeatils = getEventDetails;

export const getAllEvents = async (): Promise<ApiResponse<IEvent[]>> =>
  fetchEventAPI('/events');

export const getEventSpeakers = async (
  eid: string
): Promise<ApiResponse<ISpeaker[]>> => fetchEventAPI(`/speakers/event/${eid}`);

export const getEventSessions = async (
  eid: string
): Promise<ApiResponse<ISession[]>> => fetchEventAPI(`/sessions/event/${eid}`);

export const getForms = async (): Promise<{ data: IForm[] }> =>
  fetchEventAPI('/cms/forms');

export const getForm = async (id: string): Promise<{ data: IForm | null }> =>
  fetchEventAPI(`/cms/forms/${id}`);
