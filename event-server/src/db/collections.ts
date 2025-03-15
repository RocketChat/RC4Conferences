import { getDB } from "./connection";
import { Collection } from "mongodb";
import { IEvent, ISpeaker, ISession } from "../types";

export const getEventsCollection = (): Collection<IEvent> => {
  return getDB().collection<IEvent>("events");
};

export const getSpeakersCollection = (): Collection<ISpeaker> => {
  return getDB().collection<ISpeaker>("speakers");
};

export const getSessionsCollection = (): Collection<ISession> => {
  return getDB().collection<ISession>("sessions");
};
