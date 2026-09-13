import {
  LocationMetadata,
  WeatherContext,
  RouteResult,
  HeritageData,
  MemoryContribution,
  CommentItem,
  SavedItinerary,
  UserProfile,
  UserRole,
  ConnectedTripPlan,
  TrainOption,
  ConnectedStation,
} from '../types';

export async function geocodeSearch(query: string): Promise<LocationMetadata[]> {
  const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Search failed' }));
    throw new Error(err.error || 'Location resolution failed');
  }
  return res.json();
}

export async function getWeather(lat: number, lon: number): Promise<WeatherContext> {
  const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
  if (!res.ok) {
    throw new Error('Weather data unavailable');
  }
  return res.json();
}

export async function getRoute(
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number,
  mode: 'driving' | 'walking' = 'driving'
): Promise<RouteResult> {
  const res = await fetch(
    `/api/route?startLat=${startLat}&startLon=${startLon}&endLat=${endLat}&endLon=${endLon}&mode=${mode}`
  );
  if (!res.ok) {
    return {
      available: false,
      distanceKm: 0,
      durationMinutes: 0,
      mode,
      coordinates: [],
      source: 'OSRM Open Routing Service',
      message: 'Routing request failed',
    };
  }
  return res.json();
}

export async function getHeritageKnowledge(
  place: string,
  lat: number,
  lon: number,
  formattedAddress?: string,
  state?: string
): Promise<HeritageData> {
  const res = await fetch('/api/heritage-knowledge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ place, lat, lon, formattedAddress, state }),
  });
  if (!res.ok) {
    throw new Error('Failed to retrieve cultural knowledge');
  }
  return res.json();
}

export async function fetchCompleteHeritage(
  place: string,
  lat?: number,
  lon?: number,
  state?: string,
  district?: string,
  formattedAddress?: string
): Promise<HeritageData> {
  let resolvedLat = lat;
  let resolvedLon = lon;
  let resolvedAddress = formattedAddress;
  let resolvedState = state;

  if (resolvedLat === undefined || resolvedLon === undefined) {
    let geoResults;
    try {
      geoResults = await geocodeSearch(place);
    } catch (e) {
      console.warn('Geocoding failed, using fallback coordinates');
      geoResults = [];
    }

    if (geoResults && geoResults.length > 0) {
      resolvedLat = geoResults[0].lat;
      resolvedLon = geoResults[0].lon;
      resolvedAddress = geoResults[0].formattedAddress;
      resolvedState = geoResults[0].state;
    } else {
      // Fallback center of India coordinates
      resolvedLat = 20.5937;
      resolvedLon = 78.9629;
    }
  }

  const heritage = await getHeritageKnowledge(
    place,
    resolvedLat,
    resolvedLon,
    resolvedAddress,
    resolvedState
  );

  // Synchronously fetch live meteorological conditions for these exact coordinates
  try {
    const liveWeather = await getWeather(resolvedLat, resolvedLon);
    heritage.weather = liveWeather;
  } catch (wErr) {
    console.warn('Weather fetch failed, retaining existing weather context', wErr);
  }

  return heritage;
}

export async function askTalkToPast(
  place: string,
  persona: string,
  question: string,
  context: any,
  history: { role: string; text: string }[]
): Promise<{ reply: string; sources: string[] }> {
  const res = await fetch('/api/talk-to-past', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ place, persona, question, context, history }),
  });
  if (!res.ok) {
    throw new Error('Failed to consult past perspective');
  }
  return res.json();
}

export async function analyzeMemoryContribution(
  title: string,
  content: string,
  placeName: string,
  mediaType: string
): Promise<{
  detectedLanguage?: string;
  extractedEntities?: string[];
  traditionClassification?: string;
  preservationUrgency?: 'HIGH' | 'MEDIUM' | 'DOCUMENTED';
  audioTranscript?: string;
}> {
  const res = await fetch('/api/analyze-contribution', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, placeName, mediaType }),
  });
  if (!res.ok) {
    throw new Error('AI analysis service unavailable');
  }
  return res.json();
}

export async function fetchMemories(place?: string, status?: string): Promise<MemoryContribution[]> {
  let url = '/api/memories';
  const params = new URLSearchParams();
  if (place) params.append('place', place);
  if (status) params.append('status', status);
  if (params.toString()) url += `?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch memories');
  return res.json();
}

export async function fetchAdminMemories(): Promise<MemoryContribution[]> {
  return fetchMemories();
}

export async function submitMemory(memory: Partial<MemoryContribution>): Promise<MemoryContribution> {
  const res = await fetch('/api/memories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memory),
  });
  if (!res.ok) throw new Error('Failed to submit memory');
  return res.json();
}

export async function updateMemoryStatus(
  id: string,
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED',
  verificationNote?: string
): Promise<MemoryContribution> {
  const res = await fetch(`/api/memories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ verificationStatus, verificationNote }),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}

export async function deleteMemory(id: string): Promise<void> {
  const res = await fetch(`/api/memories/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete memory');
}

export async function fetchComments(targetType: string, targetId: string): Promise<CommentItem[]> {
  const res = await fetch(`/api/comments?targetType=${targetType}&targetId=${encodeURIComponent(targetId)}`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
}

export async function fetchReportedComments(): Promise<CommentItem[]> {
  const res = await fetch('/api/comments?reported=true');
  if (!res.ok) throw new Error('Failed to fetch reported comments');
  return res.json();
}

export async function addComment(comment: {
  targetType: string;
  targetId: string;
  text: string;
  userId: string;
  userName: string;
  userRole: UserRole;
}): Promise<CommentItem> {
  const res = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment),
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
}

export async function reportComment(id: string, reason: string): Promise<CommentItem> {
  const res = await fetch(`/api/comments/${id}/report`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error('Failed to report comment');
  return res.json();
}

export async function deleteComment(id: string): Promise<void> {
  const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete comment');
}

export async function generateItineraryPlan(payload: {
  origin?: string;
  startingPoint?: string;
  destination?: string;
  destinations?: string[];
  days?: number;
  startDate?: string;
  durationDays?: number;
  travelersCount?: number;
  budgetTier?: string;
  interests?: string[];
  style?: string;
  pace?: string;
  mode?: string;
}): Promise<any> {
  const res = await fetch('/api/plan-trip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      startingPoint: payload.startingPoint || payload.origin || 'Current Location',
      destination:
        payload.destination || (payload.destinations && payload.destinations[0]) || 'Varanasi',
      destinations: payload.destinations,
      startDate: payload.startDate || new Date().toISOString().split('T')[0],
      durationDays: payload.durationDays || payload.days || 3,
      travelersCount: payload.travelersCount || 2,
      budgetTier: payload.budgetTier || 'Moderate',
      interests: payload.interests || [payload.style || 'Heritage'],
      style: payload.style,
      pace: payload.pace,
      mode: payload.mode,
    }),
  });
  if (!res.ok) throw new Error('Failed to generate trip plan');
  const data = await res.json();
  return data.itinerary || data;
}

export async function searchTrains(
  from: string,
  to: string,
  date?: string
): Promise<{
  fromLocation: string;
  toLocation: string;
  date: string;
  originStation: ConnectedStation;
  destStation: ConnectedStation;
  trains: TrainOption[];
  providerStatus: string;
  officialBookingUrl: string;
  notice: string;
}> {
  const params = new URLSearchParams();
  params.append('from', from);
  params.append('to', to);
  if (date) params.append('date', date);

  const res = await fetch(`/api/rail/search?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Railway timetable lookup failed');
  }
  return res.json();
}

export async function generateConnectedTripPlan(payload: {
  from: string;
  to: string;
  startDate?: string;
  durationDays?: number;
  travelersCount?: number;
  budgetTier?: string;
  interests?: string[];
  style?: string;
  selectedTrainNumber?: string;
}): Promise<ConnectedTripPlan> {
  const res = await fetch('/api/plan-trip-connected', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to synthesize connected multimodal plan');
  }
  const data = await res.json();
  return data.tripPlan;
}

export async function replanDay(
  currentPlan: ConnectedTripPlan,
  dayNumber: number,
  reason?: string
): Promise<ConnectedTripPlan> {
  const res = await fetch('/api/replan-day', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPlan, dayNumber, reason }),
  });
  if (!res.ok) {
    throw new Error('Failed to replan day');
  }
  const data = await res.json();
  return data.tripPlan;
}

export async function fetchSavedItineraries(userId: string): Promise<SavedItinerary[]> {
  const res = await fetch(`/api/itineraries?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error('Failed to fetch itineraries');
  return res.json();
}

export async function saveItinerary(itinerary: Partial<SavedItinerary>): Promise<SavedItinerary> {
  const res = await fetch('/api/itineraries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itinerary),
  });
  if (!res.ok) throw new Error('Failed to save itinerary');
  return res.json();
}

export async function deleteSavedItinerary(id: string): Promise<void> {
  const res = await fetch(`/api/itineraries/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete itinerary');
}

export async function translateContent(text: string, targetLanguage: string): Promise<string> {
  if (targetLanguage === 'English') return text;
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLanguage }),
  });
  if (!res.ok) return text;
  const data = await res.json();
  return data.translatedText || text;
}

export async function signInUser(
  email: string,
  role: UserRole,
  name?: string,
  culturalSpecialization?: string,
  associatedLocation?: string,
  avatar?: string,
  photoURL?: string
): Promise<UserProfile> {
  const res = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, role, name, culturalSpecialization, associatedLocation, avatar, photoURL }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Sign in failed');
  }
  return res.json();
}

export async function signInWithGoogleApi(payload: {
  email: string;
  role: UserRole;
  name?: string;
  avatar?: string;
  photoURL?: string;
  culturalSpecialization?: string;
  associatedLocation?: string;
}): Promise<UserProfile> {
  const res = await fetch('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Google sign-in failed');
  }
  return res.json();
}

export async function switchUserRoleApi(
  userId: string,
  email: string,
  newRole: UserRole
): Promise<UserProfile> {
  const res = await fetch('/api/auth/switch-role', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, email, newRole }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to switch user role');
  }
  return res.json();
}
