import { useState, useEffect } from 'react';
import axios from 'axios';
import { getCookie } from "../Utils/GetCookie";
import Navbar from "./Navbar";

const OutgoingRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/outgoing/${getCookie("username")}`, {
          headers: {
            Authorization: `Bearer ${getCookie('access_token')}`,
          },
        });
        setRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching outgoing requests:', error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="container mx-auto p-12 mt-20">
      <Navbar />
      <h1 className="text-xl font-bold mb-4">Outgoing Requests</h1>
      <ul className="grid grid-cols-2 gap-4">
        {requests.map(request => (
          <li key={request._id} className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-medium">To: {request.to}</p>
            <p className="text-base text-gray-700">Mail Body: {request.mailBody}</p>
            <p className="text-base text-gray-700 flex items-center">
              Status: 
              <span className={`inline-block px-3 py-1 rounded-full text-base ml-2 mt-2 mb-2 ${request.status === 'approved' ? 'bg-green-800 text-white' : request.status === 'rejected' ? 'bg-red-500 text-white' : request.status === 'pending' ? 'bg-red-500 text-white' : ''} font-semibold`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OutgoingRequestsPage;