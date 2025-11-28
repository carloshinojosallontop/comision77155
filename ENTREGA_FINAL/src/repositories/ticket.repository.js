import ticketDAO from "../daos/ticket.dao.js";

class TicketRepository {
  async create(data) {
    return ticketDAO.create(data);
  }
}

export default new TicketRepository();
