import { expect, type APIRequestContext } from "@playwright/test";

/**
 * A thin typed wrapper over the `request` context. It exists so tests arrange
 * state in one line and fail loudly when the API does — not to re-describe the
 * whole API surface. Add a method when a second test needs it.
 */
export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async createOrder(data: { item: string; quantity: number }): Promise<string> {
    const response = await this.request.post("/api/orders", { data: { ...data, createdBy: "e2e" } });
    // Assert in the client: a failed arrange step must not surface later as a
    // confusing UI assertion failure.
    expect(response, `create order failed: ${response.status()}`).toBeOK();
    const { id } = (await response.json()) as { id: string };
    return id;
  }

  async deleteOrder(orderId: string): Promise<void> {
    const response = await this.request.delete(`/api/orders/${orderId}`);
    expect(response).toBeOK();
  }

  async getOrder(orderId: string): Promise<{ id: string; status: string }> {
    const response = await this.request.get(`/api/orders/${orderId}`);
    expect(response).toBeOK();
    return (await response.json()) as { id: string; status: string };
  }
}
