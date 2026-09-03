import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../../lib/axios';
import { useAuth } from '../../../providers/AuthProvider';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import { FaDownload } from 'react-icons/fa';

const TransactionHistory = () => {
  const { user } = useAuth();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/users/transactions');
      return res.data;
    },
    enabled: !!user?.email,
  });

  const generatePDF = (tx) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('TicketBari - Transaction Receipt', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Transaction ID: ${tx.transactionId}`, 20, 40);
    doc.text(`Ticket: ${tx.ticketTitle}`, 20, 50);
    doc.text(`Amount Paid: $${tx.amount.toFixed(2)}`, 20, 60);
    doc.text(`Date: ${format(new Date(tx.createdAt), 'PPpp')}`, 20, 70);
    doc.text(`Customer Name: ${user?.name || 'N/A'}`, 20, 80);
    doc.text(`Customer Email: ${user?.email || 'N/A'}`, 20, 90);

    doc.save(`ticket_${tx.transactionId}.pdf`);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Transaction History</h1>

      {transactions.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-2xl text-gray-500">No transactions yet</h2>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-box shadow">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Transaction ID</th>
                <th>Ticket Title</th>
                <th>Amount</th>
                <th>Payment Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={tx._id}>
                  <th>{index + 1}</th>
                  <td className="font-mono text-sm">{tx.transactionId}</td>
                  <td>{tx.ticketTitle}</td>
                  <td className="font-bold text-success">${tx.amount?.toFixed(2)}</td>
                  <td>{format(new Date(tx.createdAt), 'PP p')}</td>
                  <td>
                    <button 
                      onClick={() => generatePDF(tx)} 
                      className="btn btn-ghost btn-sm text-primary"
                      title="Download PDF Receipt"
                    >
                      <FaDownload />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
