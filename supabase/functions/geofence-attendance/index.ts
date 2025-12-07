// ============================================================================
// ATLAS Edge Function: Geofence Attendance
// ============================================================================
// Purpose: GPS-validated check-in/check-out with fake location detection
// Version: 1.0.0
// Last Updated: December 7, 2025 @ 16:45 UTC
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GeofenceAttendanceRequest {
  action: 'check_in' | 'check_out' | 'location_update' | 'get_zones' | 'verify_location' | 'get_logs';
  tenant_id: string;
  employee_id: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy_meters?: number;
    altitude_meters?: number;
    timestamp?: string;
  };
  device_info?: {
    model?: string;
    os?: string;
    os_version?: string;
    app_version?: string;
    is_emulator?: boolean;
    mock_location_enabled?: boolean;
  };
  wifi_info?: {
    ssid?: string;
    bssid?: string;
  };
  ip_address?: string;
  photo_url?: string;
  date_range?: {
    start_date: string;
    end_date: string;
  };
}

interface GeofenceZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  is_active: boolean;
  allowed_ip_ranges: string[];
  wifi_ssids: string[];
}

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Detect potential fake/mocked location
function detectMockedLocation(request: GeofenceAttendanceRequest): { isSuspicious: boolean; reasons: string[] } {
  const reasons: string[] = [];
  let isSuspicious = false;

  const { location, device_info } = request;

  // Check if mock location is explicitly enabled
  if (device_info?.mock_location_enabled) {
    reasons.push('Mock location is enabled on device');
    isSuspicious = true;
  }

  // Check if running on emulator
  if (device_info?.is_emulator) {
    reasons.push('Device appears to be an emulator');
    isSuspicious = true;
  }

  // Check GPS accuracy - too perfect accuracy is suspicious
  if (location?.accuracy_meters !== undefined) {
    if (location.accuracy_meters < 1) {
      reasons.push('GPS accuracy too precise (possible spoofing)');
      isSuspicious = true;
    }
    if (location.accuracy_meters > 500) {
      reasons.push('GPS accuracy too low');
      isSuspicious = true;
    }
  }

  // Check for impossible coordinates
  if (location) {
    if (location.latitude === 0 && location.longitude === 0) {
      reasons.push('Coordinates at null island (0,0)');
      isSuspicious = true;
    }
    if (Math.abs(location.latitude) > 90 || Math.abs(location.longitude) > 180) {
      reasons.push('Invalid coordinates');
      isSuspicious = true;
    }
    // Check for suspiciously round numbers
    if (location.latitude % 1 === 0 && location.longitude % 1 === 0) {
      reasons.push('Coordinates are exact integers (possible manual entry)');
      isSuspicious = true;
    }
  }

  // Check altitude (if available) - negative or extreme values are suspicious
  if (location?.altitude_meters !== undefined) {
    if (location.altitude_meters < -500 || location.altitude_meters > 10000) {
      reasons.push('Altitude out of normal range');
      isSuspicious = true;
    }
  }

  return { isSuspicious, reasons };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const request: GeofenceAttendanceRequest = await req.json();
    console.log(`[Geofence Attendance] Action: ${request.action}, Employee: ${request.employee_id}`);

    let result: any;

    switch (request.action) {
      case 'check_in':
        result = await handleCheckIn(supabase, request);
        break;
      case 'check_out':
        result = await handleCheckOut(supabase, request);
        break;
      case 'location_update':
        result = await handleLocationUpdate(supabase, request);
        break;
      case 'get_zones':
        result = await getGeofenceZones(supabase, request);
        break;
      case 'verify_location':
        result = await verifyLocation(supabase, request);
        break;
      case 'get_logs':
        result = await getAttendanceLogs(supabase, request);
        break;
      default:
        throw new Error(`Unknown action: ${request.action}`);
    }

    console.log(`[Geofence Attendance] Success: ${request.action}`);
    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err) {
    const error = err as Error;
    console.error('[Geofence Attendance] Error:', error.message);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

async function verifyLocation(supabase: any, request: GeofenceAttendanceRequest) {
  const { tenant_id, location, wifi_info, ip_address } = request;
  if (!location) throw new Error('Location is required');

  // Get active geofence zones for tenant
  const { data: zones, error: zonesError } = await supabase
    .from('geofence_zones')
    .select('*')
    .eq('tenant_id', tenant_id)
    .eq('is_active', true);

  if (zonesError) throw zonesError;
  if (!zones || zones.length === 0) {
    return { 
      is_valid: true, 
      message: 'No geofence zones configured - location accepted',
      matched_zone: null,
    };
  }

  // Check for mocked location
  const mockCheck = detectMockedLocation(request);
  if (mockCheck.isSuspicious) {
    console.log(`[Geofence Attendance] Suspicious location detected: ${mockCheck.reasons.join(', ')}`);
    return {
      is_valid: false,
      is_mocked: true,
      verification_status: 'suspicious',
      reasons: mockCheck.reasons,
      matched_zone: null,
    };
  }

  // Find matching zone
  let matchedZone: GeofenceZone | null = null;
  let closestZone: { zone: GeofenceZone; distance: number } | null = null;

  for (const zone of zones) {
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      zone.latitude,
      zone.longitude
    );

    // Track closest zone
    if (!closestZone || distance < closestZone.distance) {
      closestZone = { zone, distance };
    }

    // Check if within radius
    if (distance <= zone.radius_meters) {
      matchedZone = zone;
      break;
    }
  }

  // Additional WiFi validation if configured
  let wifiValid = true;
  if (matchedZone && matchedZone.wifi_ssids && matchedZone.wifi_ssids.length > 0) {
    if (wifi_info?.ssid) {
      wifiValid = matchedZone.wifi_ssids.includes(wifi_info.ssid);
    } else {
      wifiValid = false;
    }
  }

  // Additional IP validation if configured
  let ipValid = true;
  if (matchedZone && matchedZone.allowed_ip_ranges && matchedZone.allowed_ip_ranges.length > 0) {
    if (ip_address) {
      // Simple IP prefix check (for full CIDR, use a library)
      ipValid = matchedZone.allowed_ip_ranges.some(range => 
        ip_address.startsWith(range.split('/')[0].split('.').slice(0, 3).join('.'))
      );
    } else {
      ipValid = false;
    }
  }

  const isWithinGeofence = matchedZone !== null;
  const distanceFromZone = closestZone ? closestZone.distance : null;

  return {
    is_valid: isWithinGeofence && wifiValid && ipValid,
    is_within_geofence: isWithinGeofence,
    matched_zone: matchedZone ? {
      id: matchedZone.id,
      name: matchedZone.name,
      zone_type: (matchedZone as any).zone_type,
    } : null,
    closest_zone: closestZone ? {
      id: closestZone.zone.id,
      name: closestZone.zone.name,
      distance_meters: Math.round(closestZone.distance),
    } : null,
    distance_from_zone_meters: distanceFromZone ? Math.round(distanceFromZone) : null,
    wifi_validated: wifiValid,
    ip_validated: ipValid,
    verification_status: isWithinGeofence ? 'verified' : 'rejected',
  };
}

async function handleCheckIn(supabase: any, request: GeofenceAttendanceRequest) {
  const { tenant_id, employee_id, location, device_info, wifi_info, ip_address, photo_url } = request;
  if (!location) throw new Error('Location is required for check-in');

  // Verify location first
  const verification = await verifyLocation(supabase, request);
  
  // Check for mocked location
  const mockCheck = detectMockedLocation(request);

  // Create attendance record
  const today = new Date().toISOString().split('T')[0];
  
  // Check for existing check-in today
  const { data: existing } = await supabase
    .from('attendance_records')
    .select('id')
    .eq('employee_id', employee_id)
    .eq('attendance_date', today)
    .single();

  if (existing) {
    throw new Error('Already checked in today');
  }

  // Create attendance record
  const { data: attendance, error: attError } = await supabase
    .from('attendance_records')
    .insert({
      tenant_id,
      employee_id,
      attendance_date: today,
      check_in_time: new Date().toISOString(),
      check_in_location: `${location.latitude},${location.longitude}`,
      status: verification.is_valid ? 'present' : 'pending_verification',
      notes: !verification.is_valid ? `Location verification failed: ${verification.verification_status}` : null,
    })
    .select()
    .single();

  if (attError) throw attError;

  // Log geofence check
  const { error: logError } = await supabase
    .from('geofence_attendance_logs')
    .insert({
      tenant_id,
      employee_id,
      attendance_record_id: attendance.id,
      geofence_zone_id: verification.matched_zone?.id || null,
      action_type: 'check_in',
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy_meters: location.accuracy_meters,
      altitude_meters: location.altitude_meters,
      is_within_geofence: verification.is_within_geofence,
      distance_from_zone_meters: verification.distance_from_zone_meters,
      matched_zone_id: verification.matched_zone?.id || null,
      device_info: device_info || {},
      ip_address: ip_address,
      wifi_ssid: wifi_info?.ssid,
      is_mocked_location: mockCheck.isSuspicious,
      verification_status: verification.verification_status,
      verification_notes: mockCheck.isSuspicious ? mockCheck.reasons.join('; ') : null,
      photo_url,
    });

  if (logError) {
    console.error('[Geofence Attendance] Failed to log:', logError);
  }

  console.log(`[Geofence Attendance] Check-in recorded for ${employee_id}, verified: ${verification.is_valid}`);

  return {
    attendance_id: attendance.id,
    check_in_time: attendance.check_in_time,
    location_verified: verification.is_valid,
    matched_zone: verification.matched_zone,
    warnings: mockCheck.isSuspicious ? mockCheck.reasons : [],
  };
}

async function handleCheckOut(supabase: any, request: GeofenceAttendanceRequest) {
  const { tenant_id, employee_id, location, device_info, wifi_info, ip_address, photo_url } = request;
  if (!location) throw new Error('Location is required for check-out');

  const today = new Date().toISOString().split('T')[0];

  // Get existing attendance record
  const { data: attendance, error: fetchError } = await supabase
    .from('attendance_records')
    .select('*')
    .eq('employee_id', employee_id)
    .eq('attendance_date', today)
    .is('check_out_time', null)
    .single();

  if (fetchError || !attendance) {
    throw new Error('No active check-in found for today');
  }

  // Verify location
  const verification = await verifyLocation(supabase, request);
  const mockCheck = detectMockedLocation(request);

  // Calculate hours worked
  const checkIn = new Date(attendance.check_in_time);
  const checkOut = new Date();
  const hoursWorked = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);

  // Update attendance record
  const { error: updateError } = await supabase
    .from('attendance_records')
    .update({
      check_out_time: checkOut.toISOString(),
      check_out_location: `${location.latitude},${location.longitude}`,
      total_hours: Math.round(hoursWorked * 100) / 100,
      status: hoursWorked >= 4 ? 'present' : 'half_day',
    })
    .eq('id', attendance.id);

  if (updateError) throw updateError;

  // Log geofence check
  await supabase.from('geofence_attendance_logs').insert({
    tenant_id,
    employee_id,
    attendance_record_id: attendance.id,
    geofence_zone_id: verification.matched_zone?.id || null,
    action_type: 'check_out',
    latitude: location.latitude,
    longitude: location.longitude,
    accuracy_meters: location.accuracy_meters,
    altitude_meters: location.altitude_meters,
    is_within_geofence: verification.is_within_geofence,
    distance_from_zone_meters: verification.distance_from_zone_meters,
    matched_zone_id: verification.matched_zone?.id || null,
    device_info: device_info || {},
    ip_address: ip_address,
    wifi_ssid: wifi_info?.ssid,
    is_mocked_location: mockCheck.isSuspicious,
    verification_status: verification.verification_status,
    verification_notes: mockCheck.isSuspicious ? mockCheck.reasons.join('; ') : null,
    photo_url,
  });

  console.log(`[Geofence Attendance] Check-out recorded for ${employee_id}, hours: ${hoursWorked.toFixed(2)}`);

  return {
    attendance_id: attendance.id,
    check_in_time: attendance.check_in_time,
    check_out_time: checkOut.toISOString(),
    total_hours: Math.round(hoursWorked * 100) / 100,
    location_verified: verification.is_valid,
    matched_zone: verification.matched_zone,
    warnings: mockCheck.isSuspicious ? mockCheck.reasons : [],
  };
}

async function handleLocationUpdate(supabase: any, request: GeofenceAttendanceRequest) {
  const { tenant_id, employee_id, location, device_info } = request;
  if (!location) throw new Error('Location is required');

  const verification = await verifyLocation(supabase, request);
  const mockCheck = detectMockedLocation(request);

  // Get today's attendance record
  const today = new Date().toISOString().split('T')[0];
  const { data: attendance } = await supabase
    .from('attendance_records')
    .select('id')
    .eq('employee_id', employee_id)
    .eq('attendance_date', today)
    .single();

  // Log location update
  await supabase.from('geofence_attendance_logs').insert({
    tenant_id,
    employee_id,
    attendance_record_id: attendance?.id || null,
    action_type: 'location_update',
    latitude: location.latitude,
    longitude: location.longitude,
    accuracy_meters: location.accuracy_meters,
    is_within_geofence: verification.is_within_geofence,
    distance_from_zone_meters: verification.distance_from_zone_meters,
    matched_zone_id: verification.matched_zone?.id || null,
    device_info: device_info || {},
    is_mocked_location: mockCheck.isSuspicious,
    verification_status: mockCheck.isSuspicious ? 'suspicious' : verification.verification_status,
  });

  return {
    is_within_geofence: verification.is_within_geofence,
    matched_zone: verification.matched_zone,
    is_suspicious: mockCheck.isSuspicious,
  };
}

async function getGeofenceZones(supabase: any, request: GeofenceAttendanceRequest) {
  const { tenant_id } = request;

  const { data, error } = await supabase
    .from('geofence_zones')
    .select('*')
    .eq('tenant_id', tenant_id)
    .eq('is_active', true)
    .order('is_primary', { ascending: false });

  if (error) throw error;

  return data;
}

async function getAttendanceLogs(supabase: any, request: GeofenceAttendanceRequest) {
  const { tenant_id, employee_id, date_range } = request;

  let query = supabase
    .from('geofence_attendance_logs')
    .select(`
      *,
      employees:employee_id (full_name, employee_code),
      geofence_zones:geofence_zone_id (name, zone_type)
    `)
    .eq('tenant_id', tenant_id)
    .order('created_at', { ascending: false });

  if (employee_id) {
    query = query.eq('employee_id', employee_id);
  }

  if (date_range) {
    query = query
      .gte('created_at', `${date_range.start_date}T00:00:00`)
      .lte('created_at', `${date_range.end_date}T23:59:59`);
  } else {
    // Default to last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    query = query.gte('created_at', weekAgo.toISOString());
  }

  const { data, error } = await query.limit(500);
  if (error) throw error;

  // Summary stats
  const summary = {
    total_logs: data?.length || 0,
    verified: data?.filter((l: any) => l.verification_status === 'verified').length || 0,
    suspicious: data?.filter((l: any) => l.is_mocked_location).length || 0,
    outside_geofence: data?.filter((l: any) => !l.is_within_geofence).length || 0,
  };

  return { logs: data, summary };
}
