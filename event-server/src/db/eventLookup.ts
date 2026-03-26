import { getEventsCollection } from './collections';

export async function resolveEventId(
  idOrIdentifier: string
): Promise<number | null> {
  const numericId = Number.parseInt(idOrIdentifier, 10);

  if (!Number.isNaN(numericId) && `${numericId}` === idOrIdentifier) {
    return numericId;
  }

  const event = await getEventsCollection().findOne(
    { identifier: idOrIdentifier },
    { projection: { id: 1 } }
  );

  return event?.id ?? null;
}
