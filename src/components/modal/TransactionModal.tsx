'use client';
import * as React from 'react';

interface TransactionModalProps {
  isOpen: boolean;
  txHash: string;
  amount: string;
  onClose: () => void;
}

export default function TransactionModal({
  isOpen,
  txHash,
  amount,
  onClose,
}: TransactionModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
      onClick={onClose}
    >
      <div
        className='bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full'
        onClick={(e) => e.stopPropagation()} // prevent modal close on click inside modal
      >
        <p className='text-center text-lg'>
          {txHash == '0x000'
            ? "You've already claimed your DOGEs"
            : `Successfully claimed ${amount} DOGEs!`}
        </p>

        <a
          href={`https://optimistic.etherscan.io/tx/${txHash}`}
          target='_blank'
          rel='noopener noreferrer'
          className={`text-md text-gray-400 hover:text-purple-300 mt-2 sm:mt-0 transition-colors ${
            txHash == '0x000' ? 'hidden' : ''
          }`}
        >
          Transaction Hash : {txHash}
        </a>
      </div>
    </div>
  );
}
