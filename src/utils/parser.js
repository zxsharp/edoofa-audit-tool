/**
 * Parses raw WhatsApp export text into a structured JSON array.
 * Handles multiline messages and distinguishes system logs from dialogue.
 * @param {string} text - Raw WhatsApp export text
 * @returns {Array} List of message objects
 */
export function parseChat(text) {
  const lines = text.split(/\r?\n/);
  const messages = [];
  let currentMessage = null;
  let messageId = 1;

  // Matches: "DD/MM/YY, H:MM [am/pm] - "
  const dateRegex = /^(\d{2}\/\d{2}\/\d{2}),\s*(\d{1,2}:\d{2}(?:\s*[\u202f\u00a0\s]?(?:am|pm|AM|PM))?)\s*-\s*(.*)$/i;

  for (let line of lines) {
    if (!line.trim() && !currentMessage) continue;

    const match = line.match(dateRegex);

    if (match) {
      if (currentMessage) {
        messages.push(currentMessage);
      }

      const date = match[1];
      const time = match[2];
      const content = match[3];

      const colonIndex = content.indexOf(': ');
      if (colonIndex !== -1) {
        const sender = content.substring(0, colonIndex).trim();
        const msgText = content.substring(colonIndex + 2).trim();

        currentMessage = {
          id: messageId++,
          date,
          time,
          sender,
          text: msgText,
          isSystem: false
        };
      } else {
        currentMessage = {
          id: messageId++,
          date,
          time,
          sender: 'System',
          text: content.trim(),
          isSystem: true
        };
      }
    } else {
      if (currentMessage) {
        currentMessage.text += '\n' + line;
      } else if (line.startsWith('[') && line.endsWith(']')) {
        messages.push({
          id: messageId++,
          date: '',
          time: '',
          sender: 'System',
          text: line.trim(),
          isSystem: true
        });
      }
    }
  }

  if (currentMessage) {
    messages.push(currentMessage);
  }

  return messages.map(m => ({ ...m, text: m.text.trim() }));
}
