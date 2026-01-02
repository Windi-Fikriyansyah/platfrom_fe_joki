"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Conversation, Me, Message, WSIncoming, JobOffer } from "./types";

const WS_BASE =
  process.env.NEXT_PUBLIC_WS_URL ||
  process.env.NEXT_PUBLIC_WS_BASE_URL ||
  "ws://localhost:8080";

function updateLastMessage(
  convs: Conversation[],
  msg: Message
): Conversation[] {
  return convs
    .map((c) => {
      if (c.id !== msg.conversation_id) return c;
      return {
        ...c,
        last_message: msg,
        updated_at: msg.created_at,
      };
    })
    .sort((a, b) => {
      const ta = a.updated_at ? Date.parse(a.updated_at) : 0;
      const tb = b.updated_at ? Date.parse(b.updated_at) : 0;
      return tb - ta;
    });
}

function dedupById<T extends { id: string }>(arr: T[]) {
  const map = new Map<string, T>();
  for (const item of arr) map.set(item.id, item);
  return Array.from(map.values());
}

export function useChat(initial?: {
  initialMe?: Me | null;
  initialConversations?: Conversation[];
  initialActiveId?: string | null;
  initialMessages?: Message[];
}) {
  const [me, setMe] = useState<Me | null>(initial?.initialMe ?? null);
  const [conversations, setConversations] = useState<Conversation[]>(
    initial?.initialConversations ?? []
  );
  const [activeId, setActiveId] = useState<string | null>(
    initial?.initialActiveId ?? null
  );
  const [messages, setMessages] = useState<Message[]>(
    dedupById(initial?.initialMessages ?? [])
  );
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // WS refs
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const backoffRef = useRef<number>(800);
  const manualCloseRef = useRef(false);
  const activeIdRef = useRef<string | null>(null); // Track activeId for WebSocket

  // mark read debounce
  const markReadTimerRef = useRef<number | null>(null);

  const activeConv = useMemo(
    () => conversations.find((c) => c.id === activeId) || null,
    [conversations, activeId]
  );

  // Sync activeIdRef whenever activeId changes
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const otherUser = useMemo(() => {
    if (!me || !activeConv) return null;
    const isBuyer = me.id === activeConv.buyer_id;
    return isBuyer ? activeConv.seller : activeConv.buyer;
  }, [me, activeConv]);

  // Load data
  const loadMe = useCallback(async () => {
    if (me) return;
    try {
      setIsLoading(true);
      const json = await apiFetch<{ success: boolean; data: Me }>("/me");
      setMe(json.data);
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setIsLoading(false);
    }
  }, [me]);

  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const json = await apiFetch<{ success: boolean; data: Conversation[] }>(
        "/chat/conversations"
      );
      const sortedConvs = (json.data || []).sort((a, b) => {
        const ta = a.updated_at ? Date.parse(a.updated_at) : 0;
        const tb = b.updated_at ? Date.parse(b.updated_at) : 0;
        return tb - ta;
      });
      setConversations(sortedConvs);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const scheduleMarkRead = useCallback((cid: string, lastMsgId: string) => {
    if (markReadTimerRef.current) window.clearTimeout(markReadTimerRef.current);

    console.log(
      `[MarkRead] Scheduling mark-read for conversation ${cid}, message ${lastMsgId}`
    );

    markReadTimerRef.current = window.setTimeout(async () => {
      try {
        console.log(
          `[MarkRead] Executing mark-read for conversation ${cid}, message ${lastMsgId}`
        );

        await apiFetch(`/chat/conversations/${cid}/read`, {
          method: "PATCH",
          body: JSON.stringify({ last_read_message_id: lastMsgId }),
        });

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== cid) return c;
            console.log(`[MarkRead] Cleared unread for ${cid} after API call`);
            return { ...c, unread_count: 0 };
          })
        );
      } catch (err) {
        console.error("[MarkRead] Error marking as read:", err);
      }
    }, 350);
  }, []);

  const loadOffers = useCallback(async (cid: string) => {
    if (!cid) return;
    try {
      const json = await apiFetch<{ success: boolean; data: JobOffer[] }>(
        `/chat/conversations/${cid}/offers`
      );
      if (json.success) {
        setOffers(json.data);
      }
    } catch (error) {
      console.error("Failed to load offers:", error);
    }
  }, []);

  const loadMessages = useCallback(
    async (cid: string) => {
      if (!cid) return;
      try {
        setIsLoading(true);
        // Load messages
        const msgPromise = apiFetch<{ success: boolean; data: Message[] }>(
          `/chat/conversations/${cid}/messages?limit=50`
        );
        // Load offers in parallel
        const offersPromise = loadOffers(cid);

        const [json] = await Promise.all([msgPromise, offersPromise]);

        const deduped = dedupById(json.data || []);
        setMessages(deduped);

        const last = deduped.slice(-1)[0];
        if (last) scheduleMarkRead(cid, last.id);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [scheduleMarkRead, loadOffers]
  );

  const createOffer = useCallback(async (data: any) => {
    if (!activeIdRef.current) throw new Error("No active conversation");

    const res = await apiFetch<{ success: boolean; data: JobOffer }>(
      `/chat/conversations/${activeIdRef.current}/offers`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (res.success && res.data) {
      setOffers(prev => [res.data, ...prev]);
      return res.data;
    }
    throw new Error("Failed to create offer");
  }, []);

  // Send message
  const sendMessage = useCallback(async (content?: string) => {
    // Use activeIdRef instead of activeId for consistency
    if (!activeIdRef.current) {
      console.error("No active conversation selected");
      return;
    }

    const text = (content || message).trim();
    if (!text) return;

    const currentActiveId = activeIdRef.current;
    if (!content) setMessage("");

    // Optimistic update
    const temp: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: currentActiveId,
      sender_id: me?.id || "",
      text,
      created_at: new Date().toISOString(),
    };

    console.log(
      `[SendMessage] Sending message to conversation: ${currentActiveId}`
    );

    setMessages((prev) => dedupById([...prev, temp]));
    setConversations((prev) => updateLastMessage(prev, temp));

    try {
      const res = await apiFetch<{ success: boolean; data: Message }>(
        `/chat/conversations/${currentActiveId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ text }),
        }
      );

      console.log(`[SendMessage] Response:`, res);

      // Ensure we have valid data
      if (!res.success || !res.data) {
        throw new Error(
          `Invalid response: success=${res.success}, has data=${!!res.data}`
        );
      }

      const realMessage = res.data;

      console.log(
        `[SendMessage] Replacing temp message ${temp.id} with real message ${realMessage.id}`
      );

      // Replace temp with real message
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== temp.id);
        const updated = dedupById([...filtered, realMessage]);
        console.log(
          `[SendMessage] Messages after update: ${updated.length} messages`
        );
        return updated;
      });

      setConversations((prev) => updateLastMessage(prev, realMessage));

      // Mark as read
      if (realMessage.id) {
        scheduleMarkRead(currentActiveId, realMessage.id);
      }
    } catch (e) {
      // Rollback optimistic update
      console.error("[SendMessage] Error sending message:", e);
      setMessages((prev) => prev.filter((m) => m.id !== temp.id));
      if (!content) setMessage(text);
    }
  }, [message, me?.id, scheduleMarkRead]);

  // WS connection
  const closeWS = useCallback(() => {
    manualCloseRef.current = true;
    setWsConnected(false);

    if (reconnectTimerRef.current) {
      window.clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch { }
      wsRef.current = null;
    }
  }, []);

  const connectWS = useCallback(() => {
    if (!me?.id) {
      setWsConnected(false);
      return;
    }

    // Close existing connection
    closeWS();
    manualCloseRef.current = false;
    backoffRef.current = 800;

    // Ensure ws:// or wss:// scheme
    const base = WS_BASE.replace(/^http/, "ws");
    const url = `${base}/ws/chat?user_id=${encodeURIComponent(me.id)}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;
    setWsConnected(false);

    ws.onopen = () => {
      setWsConnected(true);
      backoffRef.current = 800; // Reset backoff on successful connection
      // Reload conversations to sync unread counts with backend
      loadConversations();
    };

    ws.onmessage = (ev) => {
      try {
        const payload: WSIncoming & any = JSON.parse(ev.data);

        // Support both legacy "message" and backend "new_message" payloads
        let msg: Message | undefined;
        if (payload.type === "message") msg = payload.data;
        else if (payload.type === "new_message") {
          msg = payload.message;
          // If payload has offer, update offers state
          if (payload.offer) {
            setOffers(prev => [payload.offer!, ...prev]);
          }
        } else if (payload.type === "offer_status_update") {
          // Update specific offer in state
          setOffers(prev => prev.map(o => o.id === payload.offer.id ? payload.offer : o));
        }

        if (msg) {
          console.log(
            `[WebSocket] Received message for conversation: ${msg.conversation_id}, activeIdRef: ${activeIdRef.current}`
          );

          const mine = me?.id && msg.sender_id === me.id;
          const isActive = activeIdRef.current === msg.conversation_id;

          // Update conversations list - only update last_message locally
          setConversations((prev) => {
            const updated = updateLastMessage(prev, msg as Message);

            return updated.map((c) => {
              if (c.id !== msg!.conversation_id) return c;

              // Own message or viewing the conversation: mark as read
              if (mine || isActive) {
                console.log(
                  `[WebSocket] Clearing unread for ${c.id} (mine=${mine}, isActive=${isActive})`
                );
                return { ...c, unread_count: 0 };
              }

              // For inactive conversations, increment unread_count locally to ensure responsiveness
              // loadConversations will eventually sync the exact count from backend
              return { ...c, unread_count: (c.unread_count || 0) + 1 };
            });
          });

          // If we're viewing this conversation, mark as read
          if (isActive) {
            scheduleMarkRead(msg.conversation_id, msg.id);
          }

          // If this is an incoming message on an inactive conversation,
          // reload conversations to get the correct unread count from backend
          if (!mine && !isActive) {
            console.log(`[WebSocket] Incoming message on inactive conversation, reloading to sync unread count`);
            loadConversations();
          }

          // If message belongs to active conversation, append to messages
          if (msg.conversation_id === activeIdRef.current) {
            console.log(
              `[WebSocket] Adding message to active conversation: ${activeIdRef.current}`
            );
            setMessages((prev) => {
              const exists = prev.some((m) => m.id === msg!.id);
              if (exists) {
                console.log(
                  `[WebSocket] Message already exists, skipping: ${msg!.id}`
                );
                return prev;
              }
              return dedupById([...prev, msg!]);
            });
          } else {
            console.log(
              `[WebSocket] Message is not for active conversation, ignoring: conv ${msg.conversation_id} vs active ${activeIdRef.current}`
            );
          }
        } else if (payload.type === "ping") {
          // Send pong response
          try {
            ws.send(JSON.stringify({ type: "pong" }));
          } catch { }
        }
      } catch (e) {
        console.error("WS parse error:", e);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setWsConnected(false);
    };

    ws.onclose = () => {
      wsRef.current = null;
      setWsConnected(false);

      if (manualCloseRef.current) return;

      const wait = backoffRef.current;
      backoffRef.current = Math.min(backoffRef.current * 1.6, 8000);

      reconnectTimerRef.current = window.setTimeout(() => {
        connectWS();
      }, wait);
    };
  }, [me?.id, scheduleMarkRead, closeWS, loadConversations]);

  // Lifecycle
  useEffect(() => {
    const init = async () => {
      try {
        if (!me) {
          await loadMe();
        }
        await loadConversations();
      } catch (error) {
        console.error("Init failed:", error);
      } finally {
        setInitialLoadComplete(true);
      }
    };

    init();
  }, [me, loadMe, loadConversations]);

  useEffect(() => {
    if (!initialLoadComplete) return;

    if (!activeId) {
      setMessages([]);
      return;
    }

    // When opening a conversation, immediately clear unread count
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeId) return c;
        console.log(
          `[Effect] Opening conversation ${activeId}, clearing unread`
        );
        return { ...c, unread_count: 0 };
      })
    );

    loadMessages(activeId);
    connectWS();
  }, [activeId, initialLoadComplete]);

  useEffect(() => {
    return () => {
      closeWS();
      if (markReadTimerRef.current)
        window.clearTimeout(markReadTimerRef.current);
    };
  }, [closeWS]);

  const openConversation = useCallback((cid: string) => {
    setActiveId(cid);
  }, []);

  const updateOffer = useCallback(async (offerId: string, data: any) => {
    try {
      if (!me) return;
      await apiFetch(`/job-offers/${offerId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      // Offer updates are handled via WebSocket offer_status_update event
    } catch (error) {
      console.error("Failed to update offer:", error);
      throw error;
    }
  }, [me]);

  return {
    me,
    otherUser,
    conversations,
    activeId,
    activeConv,
    messages,
    offers,
    message,
    setMessage,
    setActiveId: openConversation,
    sendMessage,
    createOffer,
    updateOffer,
    reloadConversations: loadConversations,
    isLoading,
    wsConnected,
    initialLoadComplete,
  };
}
