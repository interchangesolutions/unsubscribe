export async function getSubscriptions() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions`,{
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`Error fetching subscriptions: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function unsubscribe(messageId) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/unsubscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',  // Ensures cookies are sent
      body: JSON.stringify({ message_id: messageId }),
    });
    if (!response.ok) {
      throw new Error(`Error unsubscribing: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return { status: 'error', message: error.message };
  }
}
