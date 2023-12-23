
import { useState } from 'react';
import { useQuery } from 'react-query';
import create from 'zustand';
import 'bootstrap/dist/css/bootstrap.min.css';

const fetchTickets = async () => {
  const response = await fetch('https://tfyincvdrafxe7ut2ziwuhe5cm0xvsdu.lambda-url.ap-south-1.on.aws/ticketAndUsers');
  const data = await response.json();
  return data.tickets;
};

const useStore = create((set) => ({
  tickets: [],
  grouping: 'status',
  sortBy: 'priority',
  setGrouping: (grouping) => set({ grouping }),
  setSortBy: (sortBy) => set({ sortBy }),
}));

const Home = () => {
  const { tickets, grouping, sortBy, setGrouping, setSortBy } = useStore();
  const { data: fetchedTickets } = useQuery('tickets', fetchTickets);

  useStore.setState({ tickets: fetchedTickets });

  const groupedTickets = groupTickets(tickets, grouping);
  const sortedTickets = sortTickets(sortBy, tickets);

  return (
    <div className="container mt-4">
      <div className="mb-3">
        <button className="btn btn-primary" onClick={() => setGrouping('status')}>Group by Status</button>
        <button className="btn btn-primary mx-2" onClick={() => setGrouping('user')}>Group by User</button>
        <button className="btn btn-primary" onClick={() => setGrouping('priority')}>Group by Priority</button>
      </div>

      <div className="mb-3">
        <button className="btn btn-secondary" onClick={() => setSortBy('priority')}>Sort by Priority</button>
        <button className="btn btn-secondary mx-2" onClick={() => setSortBy('title')}>Sort by Title</button>
      </div>

      <div className="row row-cols-3 g-4">
        {groupedTickets.map((group) => (
          <div key={group.title} className="col">
            <div className="card">
              <div className="card-header">{group.title}</div>
              <div className="card-body">
                {group.tickets.map((ticket) => (
                  <div key={ticket.id} className="bg-light p-2 m-2">
                    <p className="fw-bold">{ticket.title}</p>
                    <p>Status: {ticket.status}</p>
                    <p>Priority: {ticket.priority}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const groupTickets = (tickets, grouping) => {
  let groupedData = [];

  switch (grouping) {
    case 'status':
      tickets.forEach((ticket) => {
        const group = groupedData.find((g) => g.title === ticket.status);
        if (group) {
          group.tickets.push(ticket);
        } else {
          groupedData.push({ title: ticket.status, tickets: [ticket] });
        }
      });
      break;

    case 'user':
      tickets.forEach((ticket) => {
        const group = groupedData.find((g) => g.title === ticket.userId);
        if (group) {
          group.tickets.push(ticket);
        } else {
          groupedData.push({ title: ticket.userId, tickets: [ticket] });
        }
      });
      break;

    case 'priority':
      tickets.forEach((ticket) => {
        const group = groupedData.find((g) => g.title === ticket.priority);
        if (group) {
          group.tickets.push(ticket);
        } else {
          groupedData.push({ title: ticket.priority, tickets: [ticket] });
        }
      });
      break;

    default:
      tickets.forEach((ticket) => {
        const group = groupedData.find((g) => g.title === ticket.status);
        if (group) {
          group.tickets.push(ticket);
        } else {
          groupedData.push({ title: ticket.status, tickets: [ticket] });
        }
      });
  }

  return groupedData;
};

const sortTickets = (sortBy, tickets) => {
  let sortedTickets = [...tickets];

  switch (sortBy) {
    case 'priority':
      sortedTickets.sort((a, b) => b.priority - a.priority);
      break;

    case 'title':
      sortedTickets.sort((a, b) => a.title.localeCompare(b.title));
      break;

    default:
      sortedTickets.sort((a, b) => b.priority - a.priority);
  }

  return sortedTickets;
};

export default Home;
