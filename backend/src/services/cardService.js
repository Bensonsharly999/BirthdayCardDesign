import { randomUUID } from 'crypto';
import { sessionRepository } from '../repositories/sessionRepository.js';
import { cardRepository } from '../repositories/cardRepository.js';
import { downloadRepository } from '../repositories/downloadRepository.js';
import { templateRepository } from '../repositories/templateRepository.js';

function mapCard(row) {
  const config = JSON.parse(row.configJson);
  return {
    id: row.id,
    position: row.position,
    templateId: row.templateId,
    slug: row.slug,
    category: row.category,
    categoryLabel: row.categoryLabel,
    name: row.name,
    wish: config.wish,
    canvas: config.canvas,
    layout: config.layout,
    template: config,
  };
}

export const cardService = {
  createSession(personName) {
    const name = String(personName || '').trim();
    if (!name || name.length > 48) {
      const error = new Error('Please enter a name between 1 and 48 characters.');
      error.status = 400;
      throw error;
    }
    const session = sessionRepository.create({
      id: randomUUID(),
      personName: name,
    });
    return session;
  },

  getSession(id) {
    const session = sessionRepository.findById(id);
    if (!session) {
      const error = new Error('Session not found.');
      error.status = 404;
      throw error;
    }
    return session;
  },

  attachPhoto(id, photoPath) {
    this.getSession(id);
    return sessionRepository.updatePhoto(id, photoPath);
  },

  generate(sessionId) {
    const session = this.getSession(sessionId);
    const templates = templateRepository.findAll();
    if (templates.length !== 50) {
      const error = new Error('Template catalog is incomplete. Please restart the server.');
      error.status = 500;
      throw error;
    }
    cardRepository.replaceForSession(
      sessionId,
      templates.map((t) => t.id),
    );
    const cards = cardRepository.findBySession(sessionId).map(mapCard);
    return { session, cards, total: cards.length };
  },

  listCards(sessionId) {
    this.getSession(sessionId);
    return cardRepository.findBySession(sessionId).map(mapCard);
  },

  getCard(sessionId, position) {
    this.getSession(sessionId);
    const row = cardRepository.findBySessionAndPosition(sessionId, Number(position));
    if (!row) {
      const error = new Error('Card not found.');
      error.status = 404;
      throw error;
    }
    return mapCard(row);
  },

  recordDownload(sessionId, templateId) {
    this.getSession(sessionId);
    return downloadRepository.create({ sessionId, templateId });
  },
};
