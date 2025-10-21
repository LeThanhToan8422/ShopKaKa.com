import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Define the payment notification type
export interface PaymentNotification {
  success: boolean;
  message: string;
  item: {
    id: number;
    gateway: string;
    transactionDate: string;
    transferAmount: number;
    code: string;
    content: string;
  };
}

// Define event handlers type
type PaymentNotificationHandler = (data: PaymentNotification) => void;

class PaymentSocketService {
  private stompClient: Client | null = null;
  private userId: string | null = null;
  private isConnected = false;
  private paymentHandlers: PaymentNotificationHandler[] = [];
  private subscription: StompSubscription | null = null;

  // Initialize the socket connection
  init(userId: string) {
    if (this.stompClient && this.userId === userId && this.isConnected) {
      return;
    }

    // Close existing connection if any
    this.disconnect();

    this.userId = userId;
    
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    if (!token) {
      console.error('No authentication token available');
      return;
    }

    // Create SockJS connection
    const socketUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`;
    const socket = new SockJS(socketUrl);
    
    // Create STOMP client
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // Set up connection handlers
    this.stompClient.onConnect = (frame) => {
      console.log('Connected to payment notification socket:', frame);
      this.isConnected = true;
      
      // Subscribe to the payment channel
      const subscriptionUrl = `/queue/payment/${userId}`;
      const sub = this.stompClient?.subscribe(subscriptionUrl, (message: IMessage) => {
        console.log('Payment notification received:', message.body);
        
        try {
          const data: PaymentNotification = JSON.parse(message.body);
          
          // Notify all registered handlers
          this.paymentHandlers.forEach(handler => {
            try {
              handler(data);
            } catch (error) {
              console.error('Error in payment notification handler:', error);
            }
          });
        } catch (error) {
          console.error('Error parsing payment notification:', error);
        }
      });
      
      // Store the subscription
      if (sub) {
        this.subscription = sub;
      }
      
      console.log(`Subscribed to ${subscriptionUrl}`);
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP error:', frame.headers['message']);
      console.error('Details:', frame.body);
      this.isConnected = false;
    };

    this.stompClient.onDisconnect = () => {
      console.log('Disconnected from payment notification socket');
      this.isConnected = false;
    };

    this.stompClient.onWebSocketError = (error) => {
      console.error('WebSocket error:', error);
      this.isConnected = false;
    };

    // Activate the client
    this.stompClient.activate();
  }

  // Add a payment notification handler
  addPaymentHandler(handler: PaymentNotificationHandler) {
    this.paymentHandlers.push(handler);
  }

  // Remove a payment notification handler
  removePaymentHandler(handler: PaymentNotificationHandler) {
    const index = this.paymentHandlers.indexOf(handler);
    if (index !== -1) {
      this.paymentHandlers.splice(index, 1);
    }
  }

  // Disconnect the socket
  disconnect() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      this.isConnected = false;
    }
  }

  // Check if connected
  isConnectedStatus() {
    return this.isConnected;
  }
}

// Export a singleton instance
export const paymentSocketService = new PaymentSocketService();