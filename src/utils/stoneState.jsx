import { createContext, useCallback, useContext, useMemo, useReducer, useState, useEffect } from "react";
import { ALL_STONES, STONE_STATES } from "../types/stones.js";
import { gatewayFetch } from "./gatewayClient.js";

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

export function StoneStateProvider({ children, data }) {
  const [stones, dispatch] = useReducer(stoneReducer, null, buildInitialStates);
  const [connections, setConnections] = useState({
    gateway: false,
    hermes: false,
    openclaw: false,
    nineRouter: false,
    claude: false,
    lastCheckedAt: null,
    latencyMs: null,
    requestId: null,
    services: {},
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    const checkConnections = async () => {
      const startedAt = performance.now();
      let hOnline = false;
      let oOnline = false;
      let nOnline = false;
      let cOnline = false;

      try {
        const health = await gatewayFetch(data, "/health", { method: "GET", timeoutMs: 5000 });
        if (cancelled) return;

        const getService = (name) => {
          const lower = name.toLowerCase().replace(/[^a-z0-9]/g, "");
          const services = health.services || {};
          const matchKey = Object.keys(services).find(
            (k) => k.toLowerCase().replace(/[^a-z0-9]/g, "") === lower
          );
          return matchKey ? services[matchKey] : null;
        };

        const hSvc = getService("hermes");
        const oSvc = getService("openclaw");
        const nSvc = getService("nineRouter") || getService("ninerouter");
        const cSvc = getService("claude");

        hOnline = !!hSvc?.online && hSvc?.configured !== false;
        oOnline = !!oSvc?.online && oSvc?.configured !== false;
        nOnline = !!nSvc?.online && nSvc?.configured !== false;
        cOnline = !!cSvc?.online && cSvc?.configured !== false;

        setConnections({
          gateway: true,
          hermes: hOnline,
          openclaw: oOnline,
          nineRouter: nOnline,
          claude: cOnline,
          lastCheckedAt: new Date().toISOString(),
          latencyMs: Math.round(performance.now() - startedAt),
          requestId: health.requestId || health.meta?.requestId || null,
          services: health.services || {},
          telemetry: {
            version: health.version || health.meta?.version || "1.0.0",
            uptime: health.uptime || health.meta?.uptime || null,
            environment: health.environment || health.meta?.environment || "production",
            activeConnections: health.activeConnections || health.meta?.activeConnections || null,
          },
          error: null,
        });
      } catch (error) {
        if (cancelled) return;
        setConnections({
          gateway: false,
          hermes: false,
          openclaw: false,
          nineRouter: false,
          claude: false,
          lastCheckedAt: new Date().toISOString(),
          latencyMs: Math.round(performance.now() - startedAt),
          requestId: error?.requestId || error?.details?.requestId || null,
          services: {},
          error: error?.message || "Gateway offline",
        });
      }

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
    const interval = setInterval(checkConnections, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [data?.endpoints?.gateway, data?.endpoints?.gatewayToken]);

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

  return (
    <StoneStateContext.Provider value={value}>
      {children}
    </StoneStateContext.Provider>
  );
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
