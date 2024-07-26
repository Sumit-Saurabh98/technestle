import { useState, useEffect } from 'react';
import axios from 'axios';
import getCookie from "../Utils/GetCookie";
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';
import { BACKEND_SERVER } from '../Utils/constants';
import { ColorRing } from 'react-loader-spinner';

const OutgoingRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${BACKEND_SERVER}/users/${getCookie("username")}/outgoing-requests`, {
          headers: {
            Authorization: `Bearer ${getCookie('access_token')}`,
          },
        });
        setRequests(response.data);
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          navigate("/login");
        } else {
          console.error('Error fetching outgoing requests:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="color-ring-loading"
          wrapperStyle={{}}
          wrapperClass="color-ring-wrapper"
          colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
        />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-12 mt-20">
        <h1 className="text-xl font-bold mb-4">Outgoing Requests</h1>
        <ul className="grid grid-cols-2 gap-4">
          {requests.map(request => (
            <li key={request._id} className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg font-medium">To: {request.to}</p>
              <p className="text-base text-gray-700">Request Details: {request.mailBody}</p>
              <p className="text-base text-gray-700 flex items-center">
                Status: 
                <span className={`inline-block px-3 py-1 rounded-full text-base ml-2 mt-2 mb-2 ${request.status === 'approved' ? 'bg-green-800 text-white' : request.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'} font-semibold`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OutgoingRequestsPage;
