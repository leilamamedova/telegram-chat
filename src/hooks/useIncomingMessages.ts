import { useEffect } from 'react';
import {
  deleteNotification,
  extractText,
  receiveNotification,
} from '../api/api';
import { useChatStore } from '../store/store';
import type { ChatInfo, Credentials } from '../types';
import { sleep } from '../utils';

export function useIncomingMessages(creds: Credentials, chat: ChatInfo) {
  useEffect(() => {
    const controller = new AbortController();
    const { addMessage } = useChatStore.getState();

    async function poll() {
      while (!controller.signal.aborted) {
        try {
          const notification = await receiveNotification(
            creds,
            controller.signal,
          );
          if (!notification) {
            await sleep(300);
            continue;
          }

          const { body, receiptId } = notification;
          const text = extractText(notification);
          const from = body.senderData?.chatId;

          if (
            body.typeWebhook === 'incomingMessageReceived' &&
            text &&
            from &&
            from === chat.chatId
          ) {
            addMessage({
              id: body.idMessage ?? String(receiptId),
              text,
              direction: 'in',
              timestamp: body.timestamp ? body.timestamp * 1000 : Date.now(),
              status: 'sent',
            });
          }

          await deleteNotification(creds, receiptId);
        } catch {
          if (controller.signal.aborted) return;
          await sleep(3000);
        }
      }
    }

    poll();
    return () => controller.abort();
  }, [creds, chat]);
}
