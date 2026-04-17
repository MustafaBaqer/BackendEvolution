import { z } from 'zod';
 
/**
 * Domain Schema: Absolute strictness at the edge.
 * We reject any anomaly before it touches the event loop core.
 */
const GpsPointSchema = z.object({
  deviceId: z.string().uuid({ message: "Invalid Device Identity" }),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  speed: z.number().nonnegative(),
  timestamp: z.number().int().positive() // Unix epoch for high-speed indexing
}).strict(); // Critical: Blocks unexpected fields to prevent memory bloat
 
export const validateGpsSchema = (payload: unknown) => {
  // safeParse prevents throwing exceptions which are costly in V8
  const result = GpsPointSchema.safeParse(payload);
  
  if (!result.success) {
    return { 
      isValid: false, 
      errors: result.error.flatten().fieldErrors 
    };
  }
  
  return { 
    isValid: true, 
    data: result.data // Strongly typed & sanitized payload
  };
};