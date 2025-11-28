import Ticket from "../models/ticket.model.js";

class TicketDAO {
  async create(data) {
    const ticket = new Ticket(data);
    return ticket.save();
  }
}

export default new TicketDAO();
