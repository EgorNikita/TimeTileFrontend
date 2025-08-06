import { defineStore } from "pinia";
import { MESSAGES_HUB_URL } from "@/constants";
import * as signalR from "@microsoft/signalr";
import { MessageEnrichedWithUserInfo } from "@/tanStackQueries/student/message/useMessagesWithStudent";

// Enum of events you expect from backend
export enum WebSocketMessage {
  MessageReceived = "MessageReceived",
  MessageEdited = "MessageEdited",
}

// Optional: map events to payload types
export interface WebSocketPayloads {
  [WebSocketMessage.MessageReceived]: MessageEnrichedWithUserInfo;
  [WebSocketMessage.MessageEdited]: MessageEnrichedWithUserInfo;
}

export const useSignalRStore = defineStore("signalR", {
  state: () => ({
    connection: null as signalR.HubConnection | null,
    isConnected: false,
    isConnecting: false,
  }),

  actions: {
    async ensureConnected() {
      if (this.isConnected || this.isConnecting) return;

      this.isConnecting = true;

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(MESSAGES_HUB_URL, {
          withCredentials: true,
        })
        .withAutomaticReconnect()
        .build();

      // Connection lifecycle
      this.connection.onclose(() => {
        this.isConnected = false;
        console.warn("SignalR disconnected");
      });

      this.connection.onreconnected(() => {
        this.isConnected = true;
        console.log("SignalR reconnected");
      });

      try {
        await this.connection.start();
        this.isConnected = true;
        console.log("SignalR connected");
      } catch (err) {
        console.error("SignalR connection failed:", err);
      } finally {
        this.isConnecting = false;
      }
    },

    // Subscribe to an event (lazy connect)
    async on<K extends keyof WebSocketPayloads>(
      event: K,
      callback: (data: WebSocketPayloads[K]) => void,
    ) {
      await this.ensureConnected();
      this.connection?.on(event, callback);
    },

    // Unsubscribe from event
    off<K extends keyof WebSocketPayloads>(
      event: K,
      callback: (data: WebSocketPayloads[K]) => void,
    ) {
      this.connection?.off(event, callback);
    },

    // Optional: send message to server
    async send<T>(method: string, courseId: number, data: T) {
      await this.ensureConnected();
      await this.connection?.invoke(method, courseId, data);
    },
  },
});
