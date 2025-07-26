import { defineStore } from "pinia";
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { MESSAGES_HUB_URL } from "@/constants";
import { useAuthStore } from "@/store/modules/auth";

interface SignalRState {
  connection: HubConnection | null;
  pendingHandlers: Array<{ methodName: WebSocketMessage; handler: (...args: any[]) => void }>;
}

export enum WebSocketMessage {
  MessageReceived = "MessageReceived",
  MessageEdited = "MessageEdited",
}

export const useSignalRStore = defineStore('signalR', {
  state: (): SignalRState => ({
    connection: null,
    pendingHandlers: []
  }),

  getters: {
    isConnected(state) {
      return state.connection?.state === HubConnectionState.Connected;
    }
  },

  actions: {
    async connect() {
      try {
        if (this.connection?.state === HubConnectionState.Connected) return;

        const auth = useAuthStore();

        if (!auth.token) {
          console.log('No token available, skipping SignalR connection');
          return;
        }

        this.connection = new HubConnectionBuilder()
          .withUrl(MESSAGES_HUB_URL, {
            accessTokenFactory: () => auth.token!,
          })
          .withAutomaticReconnect()
          .build();

        await this.connection.start();
        console.log('SignalR Connected');

        // Replay handlers
        for (const { methodName, handler } of this.pendingHandlers) {
          this.connection.on(methodName, handler);
        }
        this.pendingHandlers = [];
      } catch (error) {
        console.error('Failed to connect to SignalR:', error);
        throw error;
      }
    },

    async disconnect(): Promise<void> {
      if (this.connection) {
        // Remove all handlers or keep track of registered ones
        Object.values(WebSocketMessage).forEach(message => {
          this.connection!.off(message);
        });

        await this.connection.stop();
        this.connection = null;
        console.log('SignalR disconnected');
      }
    },

    on(methodName: WebSocketMessage, handler: (...args: any[]) => void){
      if (this.connection?.state === HubConnectionState.Connected) {
        this.connection.on(methodName, handler);
      } else {
        this.pendingHandlers.push({ methodName, handler });
      }
    },

    off(methodName: WebSocketMessage, handler: (...args: any[]) => void) {
      if (this.connection?.state === HubConnectionState.Connected) {
        this.connection.off(methodName, handler);
      }

      // Remove from pending handlers
      this.pendingHandlers = this.pendingHandlers.filter(
        pending => !(pending.methodName === methodName && pending.handler === handler)
      );
    },

    async sendMessage(courseId: number, content: string) {
      if (this.connection?.state === HubConnectionState.Connected) {
        await this.connection.invoke('SendMessage', courseId, content);
      } else {
        throw new Error('SignalR connection is not established');
      }
    },

    async editMessage(messageId: number, content: string) {
      if (this.connection?.state === HubConnectionState.Connected) {
        await this.connection.invoke('EditMessage', messageId, content);
      } else {
        throw new Error('SignalR connection is not established');
      }
    },

    async addStudentToGroup(courseId: number, studentId: number) {
      if (this.connection?.state === HubConnectionState.Connected) {
        await this.connection.invoke('JoinGroupAsStudent', courseId, studentId);
      } else {
        throw new Error('SignalR connection is not established');
      }
    },

    // Other methods to handle groups
    // ...
    // ...
    // ...
  },
});