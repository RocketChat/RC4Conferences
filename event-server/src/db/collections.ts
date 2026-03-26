import { getDB } from "./connection";
import { Collection } from "mongodb";
import {
  IEvent,
  ISpeaker,
  ISession,
  ICarousel,
  IPersona,
  IGuide,
  IReleaseNote,
  ITopNav,
  IForm,
} from "../types";

export const getEventsCollection = (): Collection<IEvent> => {
  return getDB().collection<IEvent>("events");
};

export const getSpeakersCollection = (): Collection<ISpeaker> => {
  return getDB().collection<ISpeaker>("speakers");
};

export const getSessionsCollection = (): Collection<ISession> => {
  return getDB().collection<ISession>("sessions");
};

export const getCarouselsCollection = (): Collection<ICarousel> => {
  return getDB().collection<ICarousel>("carousels");
};

export const getPersonasCollection = (): Collection<IPersona> => {
  return getDB().collection<IPersona>("personas");
};

export const getGuidesCollection = (): Collection<IGuide> => {
  return getDB().collection<IGuide>("guides");
};

export const getReleaseNotesCollection = (): Collection<IReleaseNote> => {
  return getDB().collection<IReleaseNote>("release_notes");
};

export const getTopNavCollection = (): Collection<ITopNav> => {
  return getDB().collection<ITopNav>("top_nav");
};

export const getFormsCollection = (): Collection<IForm> => {
  return getDB().collection<IForm>("forms");
};
