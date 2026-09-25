export const mockData = {
  "fixture": [
    {
      "id": 1,
      "fixture_code": "SPOT-01",
      "fixture_type": "SPOT",
      "position_x": "position x 1",
      "position_y": "position y 1",
      "dmx_address": "dmx address 1",
      "channel_count": "channel count 1",
      "color_mode": "color mode 1"
    },
    {
      "id": 2,
      "fixture_code": "WASH-01",
      "fixture_type": "WASH",
      "position_x": "position x 2",
      "position_y": "position y 2",
      "dmx_address": "dmx address 2",
      "channel_count": "channel count 2",
      "color_mode": "color mode 2"
    },
    {
      "id": 3,
      "fixture_code": "BEAM-01",
      "fixture_type": "BEAM",
      "position_x": "position x 3",
      "position_y": "position y 3",
      "dmx_address": "dmx address 3",
      "channel_count": "channel count 3",
      "color_mode": "color mode 3"
    },
    {
      "id": 4,
      "fixture_code": "PAR-01",
      "fixture_type": "PAR",
      "position_x": "position x 4",
      "position_y": "position y 4",
      "dmx_address": "dmx address 4",
      "channel_count": "channel count 4",
      "color_mode": "color mode 4"
    },
    {
      "id": 5,
      "fixture_code": "PAR-02",
      "fixture_type": "PAR",
      "position_x": "position x 5",
      "position_y": "position y 5",
      "dmx_address": "dmx address 5",
      "channel_count": "channel count 5",
      "color_mode": "color mode 5"
    },
    {
      "id": 6,
      "fixture_code": "PAR-03",
      "fixture_type": "PAR",
      "position_x": "position x 6",
      "position_y": "position y 6",
      "dmx_address": "dmx address 6",
      "channel_count": "channel count 6",
      "color_mode": "color mode 6"
    },
    {
      "id": 7,
      "fixture_code": "SPOT-02",
      "fixture_type": "SPOT",
      "position_x": "position x 7",
      "position_y": "position y 7",
      "dmx_address": "dmx address 7",
      "channel_count": "channel count 7",
      "color_mode": "color mode 7"
    },
    {
      "id": 8,
      "fixture_code": "WASH-02",
      "fixture_type": "WASH",
      "position_x": "position x 8",
      "position_y": "position y 8",
      "dmx_address": "dmx address 8",
      "channel_count": "channel count 8",
      "color_mode": "color mode 8"
    },
    {
      "id": 9,
      "fixture_code": "STROBE-01",
      "fixture_type": "STROBE",
      "position_x": "position x 9",
      "position_y": "position y 9",
      "dmx_address": "dmx address 9",
      "channel_count": "channel count 9",
      "color_mode": "color mode 9"
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
  ],
  "powerCircuit": [
    { "id": 1, "circuit_code": "C-101", "phase": "L1", "rated_amps": 32, "status": "ACTIVE" },
    { "id": 2, "circuit_code": "C-102", "phase": "L1", "rated_amps": 32, "status": "ACTIVE" },
    { "id": 3, "circuit_code": "C-103", "phase": "L1", "rated_amps": 16, "status": "ACTIVE" },
    { "id": 4, "circuit_code": "C-201", "phase": "L2", "rated_amps": 32, "status": "ACTIVE" },
    { "id": 5, "circuit_code": "C-202", "phase": "L2", "rated_amps": 32, "status": "ACTIVE" },
    { "id": 6, "circuit_code": "C-203", "phase": "L2", "rated_amps": 16, "status": "MAINTENANCE" },
    { "id": 7, "circuit_code": "C-301", "phase": "L3", "rated_amps": 32, "status": "ACTIVE" },
    { "id": 8, "circuit_code": "C-302", "phase": "L3", "rated_amps": 32, "status": "ACTIVE" },
    { "id": 9, "circuit_code": "C-303", "phase": "L3", "rated_amps": 16, "status": "ACTIVE" }
  ],
  "fixtureHookup": [
    { "id": 1, "fixture_id": 1, "wattage": 1200, "circuit_id": 1 },
    { "id": 2, "fixture_id": 2, "wattage": 800, "circuit_id": 1 },
    { "id": 3, "fixture_id": 3, "wattage": 1500, "circuit_id": 4 },
    { "id": 4, "fixture_id": 4, "wattage": 750, "circuit_id": 2 },
    { "id": 5, "fixture_id": 5, "wattage": 750, "circuit_id": 2 },
    { "id": 6, "fixture_id": 6, "wattage": 750, "circuit_id": 8 },
    { "id": 7, "fixture_id": 7, "wattage": 1200, "circuit_id": 5 },
    { "id": 8, "fixture_id": 8, "wattage": 800, "circuit_id": 4 },
    { "id": 9, "fixture_id": 9, "wattage": 3000, "circuit_id": 7 }
  ],
  "powerSnapshot": [
    {
      "id": 1,
      "name": "开演前基准快照",
      "created_at": "2026-09-24T21:30:00+08:00",
      "total_watts": 10250,
      "imbalance": 0.073,
      "phase_loads": { "L1": 15.9, "L2": 15.9, "L3": 14.8 },
      "hookups": [
        { "id": 1, "fixture_id": 1, "wattage": 1200, "circuit_id": 1 },
        { "id": 2, "fixture_id": 2, "wattage": 800, "circuit_id": 1 },
        { "id": 3, "fixture_id": 3, "wattage": 1500, "circuit_id": 4 },
        { "id": 4, "fixture_id": 4, "wattage": 750, "circuit_id": 2 },
        { "id": 5, "fixture_id": 5, "wattage": 750, "circuit_id": 2 },
        { "id": 6, "fixture_id": 6, "wattage": 750, "circuit_id": 8 },
        { "id": 7, "fixture_id": 7, "wattage": 1200, "circuit_id": 5 },
        { "id": 8, "fixture_id": 8, "wattage": 800, "circuit_id": 4 },
        { "id": 9, "fixture_id": 9, "wattage": 2500, "circuit_id": 7 }
      ]
    }
  ]
} as const;
