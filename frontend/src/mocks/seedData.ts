export const mockData = {
  "fixture": [
    {
      "id": 1,
      "fixture_code": "PAR-01",
      "fixture_type": "PAR",
      "position_x": "2.0",
      "position_y": "4.5",
      "dmx_address": "A001",
      "channel_count": 4,
      "color_mode": "RGBW",
      "power_watt": 1000,
      "circuit_id": 1
    },
    {
      "id": 2,
      "fixture_code": "PAR-02",
      "fixture_type": "PAR",
      "position_x": "4.0",
      "position_y": "4.5",
      "dmx_address": "A005",
      "channel_count": 4,
      "color_mode": "RGBW",
      "power_watt": 1000,
      "circuit_id": 1
    },
    {
      "id": 3,
      "fixture_code": "SPT-01",
      "fixture_type": "SPOT",
      "position_x": "6.0",
      "position_y": "4.5",
      "dmx_address": "A009",
      "channel_count": 8,
      "color_mode": "MOVING_HEAD",
      "power_watt": 750,
      "circuit_id": 2
    },
    {
      "id": 4,
      "fixture_code": "WSH-01",
      "fixture_type": "WASH",
      "position_x": "8.0",
      "position_y": "4.5",
      "dmx_address": "A017",
      "channel_count": 6,
      "color_mode": "RGBW",
      "power_watt": 1200,
      "circuit_id": 3
    },
    {
      "id": 5,
      "fixture_code": "BEM-01",
      "fixture_type": "BEAM",
      "position_x": "10.0",
      "position_y": "4.5",
      "dmx_address": "A023",
      "channel_count": 16,
      "color_mode": "MOVING_HEAD",
      "power_watt": 1500,
      "circuit_id": 4
    },
    {
      "id": 6,
      "fixture_code": "WSH-02",
      "fixture_type": "WASH",
      "position_x": "12.0",
      "position_y": "4.5",
      "dmx_address": "A039",
      "channel_count": 6,
      "color_mode": "RGBW",
      "power_watt": 1200,
      "circuit_id": 5
    },
    {
      "id": 7,
      "fixture_code": "PAR-03",
      "fixture_type": "PAR",
      "position_x": "14.0",
      "position_y": "4.5",
      "dmx_address": "A045",
      "channel_count": 4,
      "color_mode": "RGB",
      "power_watt": 1200,
      "circuit_id": 5
    },
    {
      "id": 8,
      "fixture_code": "STB-01",
      "fixture_type": "STROBE",
      "position_x": "16.0",
      "position_y": "4.5",
      "dmx_address": "A049",
      "channel_count": 3,
      "color_mode": "DIMMER_ONLY",
      "power_watt": 800,
      "circuit_id": null
    }
  ],
  "powerCircuit": [
    {
      "id": 1,
      "circuit_code": "C1",
      "phase": "L1",
      "rated_amp": 16,
      "maintenance_status": "NORMAL"
    },
    {
      "id": 2,
      "circuit_code": "C2",
      "phase": "L1",
      "rated_amp": 16,
      "maintenance_status": "NORMAL"
    },
    {
      "id": 3,
      "circuit_code": "C3",
      "phase": "L2",
      "rated_amp": 16,
      "maintenance_status": "NORMAL"
    },
    {
      "id": 4,
      "circuit_code": "C4",
      "phase": "L2",
      "rated_amp": 32,
      "maintenance_status": "NORMAL"
    },
    {
      "id": 5,
      "circuit_code": "C5",
      "phase": "L3",
      "rated_amp": 16,
      "maintenance_status": "NORMAL"
    },
    {
      "id": 6,
      "circuit_code": "C6",
      "phase": "L3",
      "rated_amp": 16,
      "maintenance_status": "MAINTENANCE"
    }
  ],
  "showSnapshot": [
    {
      "id": 1,
      "title": "首演夜配电快照",
      "published_at": "2026-09-20T19:30:00Z",
      "hookups": [
        { "fixture_id": 1, "fixture_code": "PAR-01", "power_watt": 1000, "circuit_id": 1, "circuit_code": "C1", "phase": "L1" },
        { "fixture_id": 2, "fixture_code": "PAR-02", "power_watt": 1000, "circuit_id": 1, "circuit_code": "C1", "phase": "L1" },
        { "fixture_id": 3, "fixture_code": "SPT-01", "power_watt": 750, "circuit_id": 2, "circuit_code": "C2", "phase": "L1" },
        { "fixture_id": 4, "fixture_code": "WSH-01", "power_watt": 1200, "circuit_id": 3, "circuit_code": "C3", "phase": "L2" },
        { "fixture_id": 5, "fixture_code": "BEM-01", "power_watt": 1500, "circuit_id": 4, "circuit_code": "C4", "phase": "L2" },
        { "fixture_id": 6, "fixture_code": "WSH-02", "power_watt": 1200, "circuit_id": 5, "circuit_code": "C5", "phase": "L3" },
        { "fixture_id": 7, "fixture_code": "PAR-03", "power_watt": 1200, "circuit_id": 5, "circuit_code": "C5", "phase": "L3" },
        { "fixture_id": 8, "fixture_code": "STB-01", "power_watt": 800, "circuit_id": 6, "circuit_code": "C6", "phase": "L3" }
      ],
      "circuits": [
        { "id": 1, "circuit_code": "C1", "phase": "L1", "rated_amp": 16, "maintenance_status": "NORMAL" },
        { "id": 2, "circuit_code": "C2", "phase": "L1", "rated_amp": 16, "maintenance_status": "NORMAL" },
        { "id": 3, "circuit_code": "C3", "phase": "L2", "rated_amp": 16, "maintenance_status": "NORMAL" },
        { "id": 4, "circuit_code": "C4", "phase": "L2", "rated_amp": 32, "maintenance_status": "NORMAL" },
        { "id": 5, "circuit_code": "C5", "phase": "L3", "rated_amp": 16, "maintenance_status": "NORMAL" },
        { "id": 6, "circuit_code": "C6", "phase": "L3", "rated_amp": 16, "maintenance_status": "NORMAL" }
      ],
      "phase_loads": [
        { "phase": "L1", "total_watt": 2750, "load_amp": 12.5 },
        { "phase": "L2", "total_watt": 2700, "load_amp": 12.27 },
        { "phase": "L3", "total_watt": 3200, "load_amp": 14.55 }
      ],
      "total_watt": 8650,
      "imbalance_ratio": 0.156
    }
  ],
  "cueScene": [
    {
      "id": 1,
      "name": "name 1",
      "fixture_states": "fixture states 1",
      "fade_in_ms": "fade in ms 1",
      "hold_ms": "hold ms 1",
      "priority": "priority 1",
      "scene_status": "READY"
    },
    {
      "id": 2,
      "name": "name 2",
      "fixture_states": "fixture states 2",
      "fade_in_ms": "fade in ms 2",
      "hold_ms": "hold ms 2",
      "priority": "priority 2",
      "scene_status": "DISABLED"
    },
    {
      "id": 3,
      "name": "name 3",
      "fixture_states": "fixture states 3",
      "fade_in_ms": "fade in ms 3",
      "hold_ms": "hold ms 3",
      "priority": "priority 3",
      "scene_status": "DRAFT"
    }
  ],
  "timelineTrack": [
    {
      "id": 1,
      "cue_scene_id": 1,
      "start_ms": "start ms 1",
      "duration_ms": "duration ms 1",
      "layer": "layer 1",
      "locked": "locked 1"
    },
    {
      "id": 2,
      "cue_scene_id": 2,
      "start_ms": "start ms 2",
      "duration_ms": "duration ms 2",
      "layer": "layer 2",
      "locked": "locked 2"
    },
    {
      "id": 3,
      "cue_scene_id": 3,
      "start_ms": "start ms 3",
      "duration_ms": "duration ms 3",
      "layer": "layer 3",
      "locked": "locked 3"
    }
  ],
  "showProject": [
    {
      "id": 1,
      "title": "title 1",
      "venue_name": "venue name 1",
      "fixture_ids": [
        1,
        2
      ],
      "track_ids": [
        1,
        2
      ],
      "updated_at": "2026-06-11T09:00:00Z"
    },
    {
      "id": 2,
      "title": "title 2",
      "venue_name": "venue name 2",
      "fixture_ids": [
        1,
        2
      ],
      "track_ids": [
        1,
        2
      ],
      "updated_at": "2026-06-12T09:00:00Z"
    },
    {
      "id": 3,
      "title": "title 3",
      "venue_name": "venue name 3",
      "fixture_ids": [
        1,
        2
      ],
      "track_ids": [
        1,
        2
      ],
      "updated_at": "2026-06-13T09:00:00Z"
    }
  ]
} as const;
