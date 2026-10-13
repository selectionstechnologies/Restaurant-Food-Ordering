import type { Order } from '../types';
import { readStorage, STORAGE_KEYS, writeStorage } from './storage';

/** Generates a demo order number like "SAV-48K2QZ". Not a real order reference. */
export function generateOrderNumber(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  const values = new Uint32Array(6);
  crypto.getRandomValues(values);
  values.forEach((v) => (code += alphabet[v % alphabet.length]));
  return `SAV-${code}`;
}

export function saveOrder(order: Order): void {
  const orders = readStorage<Order[]>(STORAGE_KEYS.orders, []);
  writeStorage(STORAGE_KEYS.orders, [order, ...orders].slice(0, 20));
}

export function getOrders(): Order[] {
  return readStorage<Order[]>(STORAGE_KEYS.orders, []);
}

export function findOrder(orderNumber: string): Order | undefined {
  const normalized = orderNumber.trim().toUpperCase();
  return getOrders().find((o) => o.orderNumber === normalized);
}

export function getLatestOrder(): Order | undefined {
  return getOrders()[0];
}
