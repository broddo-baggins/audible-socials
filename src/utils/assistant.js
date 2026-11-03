export const OPEN_ASSISTANT_EVENT = 'listenable:open-assistant';

/** Open the floating AI assistant on a tab ('recommendations' or 'chat'). */
export const openAIAssistant = (tab = 'recommendations') => {
  window.dispatchEvent(new CustomEvent(OPEN_ASSISTANT_EVENT, { detail: { tab } }));
};
