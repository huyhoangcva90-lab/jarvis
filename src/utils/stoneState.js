import { createContext, createElement, useCallback, useContext, useMemo, useReducer, useState, useEffect } from "react";
import { ALL_STONES, STONE_STATES } from "../types/stones.js";

// ─── Initial State ───────────────────────────────────────────
function buildInitialStates() {
  const states = {};
  for (const id of ALL_STONES) {
    states[id] = {
      status: STONE_STATES.DORMANT,
      lastEvent: null,
      lastError: null,
      connectedAt: null,
      metrics: {},  // Stone-specific metrics (e.g. latency, agent count)
    };
  }
  return states;
}

// ─── Reducer ─────────────────────────────────────────────────
function stoneReducer(state, action) {
  switch (action.type) {
    case "SET_STATUS": {
      const { stoneId, status, metrics, error } = action.payload;
      return {
        ...state,
        [stoneId]: {
          ...state[stoneId],
          status,
          lastEvent: new Date().toISOString(),
          lastError: error !== undefined ? error : state[stoneId].lastError,
          metrics: metrics ? { ...state[stoneId].metrics, ...metrics } : state[stoneId].metrics,
        },
      };
    }
    case "SET_CONNECTED": {
      const { stoneId } = action.payload;
      return {
        ...state,
        [stoneId]: {
          ...state[stoneId],
          connectedAt: new Date().toISOString(),
          status: STONE_STATES.READING,
          lastEvent: new Date().toISOString(),
        },
      };
    }
    case "SET_DISCONNECTED": {
      const { stoneId, error } = action.payload;
      return {
        ...state,
        [stoneId]: {
          ...state[stoneId],
          status: STONE_STATES.ERROR,
          connectedAt: null,
          lastError: error || "Connection lost",
          lastEvent: new Date().toISOString(),
        },
      };
    }
    case "RESET_ALL":
      return buildInitialStates();
    default:
      return state;
    }
}

// ─── Context ─────────────────────────────────────────────────
const StoneStateContext = createContext(null);

export function StoneStateProvider({ children }) {
  const [stones, dispatch] = useReducer(stoneReducer, null, buildInitialStates);
  const [connections, setConnections] = useState({
    hermes: true,
    openclaw: false,
    nineRouter: false
  });

  useEffect(() => {
    const checkConnections = async () => {
      let endpoints = {
        hermes: 'http://localhost:8080',
        openclaw: 'http://localhost:18789',
        nineRouter: 'http://localhost:9000',
      };
      
      try {
        const raw = localStorage.getItem("j-core-console:data:v1");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.endpoints) endpoints = parsed.endpoints;
        }
      } catch (e) {
        // Fallback
      }

      const ping = async (url) => {
        try {
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), 1000);
          await fetch(url, { method: "HEAD", mode: "no-cors", signal: controller.signal });
          clearTimeout(id);
          return true;
        } catch {
          return false;
        }
      };

      const hOnline = await ping(endpoints.hermes);
      const oOnline = await ping(endpoints.openclaw);
      const nOnline = await ping(endpoints.nineRouter);

      setConnections({
        hermes: hOnline,
        openclaw: oOnline,
        nineRouter: nOnline
      });

      // Cập nhật các stone tương ứng
      dispatch({
        type: "SET_STATUS",
        payload: {
          stoneId: "space",
          status: nOnline ? STONE_STATES.READING : STONE_STATES.ERROR,
          error: nOnline ? null : "9Router gateway is offline"
        }
      });

      dispatch({
        type: "SET_STATUS",
        payload: {
          stoneId: "power",
          status: oOnline ? STONE_STATES.READING : STONE_STATES.DORMANT,
          error: oOnline ? null : "OpenClaw agent workforce dormant"
        }
      });

      dispatch({
        type: "SET_STATUS",
        payload: {
          stoneId: "mind",
          status: hOnline ? STONE_STATES.WORKING : STONE_STATES.ERROR,
          error: hOnline ? null : "Hermes Core API offline"
        }
      });
    };

    checkConnections();
    const interval = setInterval(checkConnections, 5000);
    return () => clearInterval(interval);
  }, []);

  const setStoneStatus = useCallback((stoneId, status, extra = {}) => {
    dispatch({ type: "SET_STATUS", payload: { stoneId, status, ...extra } });
  }, []);

  const connectStone = useCallback((stoneId) => {
    dispatch({ type: "SET_CONNECTED", payload: { stoneId } });
  }, []);

  const disconnectStone = useCallback((stoneId, error) => {
    dispatch({ type: "SET_DISCONNECTED", payload: { stoneId, error } });
  }, []);

  const resetAllStones = useCallback(() => {
    dispatch({ type: "RESET_ALL" });
  }, []);

  const value = useMemo(() => ({
    stones,
    connections,
    setStoneStatus,
    connectStone,
    disconnectStone,
    resetAllStones,
  }), [stones, connections, setStoneStatus, connectStone, disconnectStone, resetAllStones]);

  return createElement(StoneStateContext.Provider, { value }, children);
}

// ─── Hook ────────────────────────────────────────────────────
export function useStoneState() {
  const ctx = useContext(StoneStateContext);
  if (!ctx) throw new Error("useStoneState must be used within StoneStateProvider");
  return ctx;
}

// ─── Selectors ───────────────────────────────────────────────
export function useStone(stoneId) {
  const { stones } = useStoneState();
  return stones[stoneId];
}

export function useAllStoneStatuses() {
  const { stones } = useStoneState();
  return ALL_STONES.map((id) => ({ id, ...stones[id] }));
}
