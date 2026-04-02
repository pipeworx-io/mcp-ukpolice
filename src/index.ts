/**
 * UK Police MCP — wraps the UK Police Data API (free, no auth)
 * https://data.police.uk/api
 *
 * Tools:
 * - get_crimes: street-level crimes near a lat/lng for a given month
 * - get_forces: list all police forces in England, Wales, and Northern Ireland
 * - get_outcomes: crime outcomes at a location for a given month
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://data.police.uk/api';

const tools: McpToolExport['tools'] = [
  {
    name: 'get_crimes',
    description:
      'Get street-level crimes near a latitude/longitude for a given month. Returns crime category, location, and outcome status.',
    inputSchema: {
      type: 'object',
      properties: {
        lat: { type: 'number', description: 'Latitude of the location' },
        lng: { type: 'number', description: 'Longitude of the location' },
        date: {
          type: 'string',
          description: 'Month to query in YYYY-MM format (e.g. "2024-01"). Defaults to latest available.',
        },
      },
      required: ['lat', 'lng'],
    },
  },
  {
    name: 'get_forces',
    description:
      'List all police forces in England, Wales, and Northern Ireland. Returns force ID and name.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_outcomes',
    description:
      'Get outcomes for crimes at a location for a given month. Returns outcome category and date for each crime.',
    inputSchema: {
      type: 'object',
      properties: {
        lat: { type: 'number', description: 'Latitude of the location' },
        lng: { type: 'number', description: 'Longitude of the location' },
        date: {
          type: 'string',
          description: 'Month to query in YYYY-MM format (e.g. "2024-01"). Defaults to latest available.',
        },
      },
      required: ['lat', 'lng'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'get_crimes':
      return getCrimes(args.lat as number, args.lng as number, args.date as string | undefined);
    case 'get_forces':
      return getForces();
    case 'get_outcomes':
      return getOutcomes(args.lat as number, args.lng as number, args.date as string | undefined);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function getCrimes(lat: number, lng: number, date?: string) {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
  });
  if (date) params.set('date', date);

  const res = await fetch(`${BASE_URL}/crimes-street/all-crime?${params}`);
  if (!res.ok) throw new Error(`UK Police API error: ${res.status}`);

  const data = (await res.json()) as Array<{
    category: string;
    location_type: string;
    location: { latitude: string; longitude: string; street: { id: number; name: string } };
    context: string;
    outcome_status: { category: string; date: string } | null;
    persistent_id: string;
    id: number;
    month: string;
  }>;

  return {
    count: data.length,
    crimes: data.map((c) => ({
      id: c.id,
      category: c.category,
      month: c.month,
      street: c.location.street.name,
      outcome: c.outcome_status?.category ?? 'Under investigation',
      outcome_date: c.outcome_status?.date ?? null,
    })),
  };
}

async function getForces() {
  const res = await fetch(`${BASE_URL}/forces`);
  if (!res.ok) throw new Error(`UK Police API error: ${res.status}`);

  const data = (await res.json()) as Array<{ id: string; name: string }>;
  return { count: data.length, forces: data };
}

async function getOutcomes(lat: number, lng: number, date?: string) {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
  });
  if (date) params.set('date', date);

  const res = await fetch(`${BASE_URL}/outcomes-at-location?${params}`);
  if (!res.ok) throw new Error(`UK Police API error: ${res.status}`);

  const data = (await res.json()) as Array<{
    category: { code: string; name: string };
    date: string;
    person_id: string | null;
    crime: { category: string; location_type: string; id: number; month: string };
  }>;

  return {
    count: data.length,
    outcomes: data.map((o) => ({
      crime_id: o.crime.id,
      crime_category: o.crime.category,
      crime_month: o.crime.month,
      outcome: o.category.name,
      outcome_date: o.date,
    })),
  };
}

export default { tools, callTool } satisfies McpToolExport;
