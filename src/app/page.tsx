'use client';

import axios from 'axios';
import dotenv from 'dotenv';
import { ArrowRight, Search, X } from 'lucide-react';
import Head from 'next/head';
import * as React from 'react';

// import '@/lib/env';
import IconButton from '@/components/buttons/IconButton';
import UnderlineLink from '@/components/links/UnderlineLink';

import { CONTRACT_ABI } from '@/config';

dotenv.config();
/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
import { isAddress } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';

import TransactionModal from '@/components/modal/TransactionModal';

import Logo from '~/svg/Logo.svg';

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  /*  const { account, isConnected, caipAddress, status, embeddedWalletInfo } =
    useAppKitAccount(); */
  const { status, address } = useAccount();
  const [value, setValue] = React.useState('');
  const [currentSearchAddress, setCurrentSearchAddress] = React.useState('');
  const [currentSearchAmount, setCurrentSearchAmount] = React.useState('');
  const [currentMyAmount, setCurrentMyAmount] = React.useState(0);
  const [txHash, setTxHash] = React.useState('0x000');
  const [isOpen, setIsOpen] = React.useState(false);
  const { writeContractAsync } = useWriteContract();
  const onSearch = () => {
    if (isAddress(value) === false) {
      setValue('');
      return;
    }
    setCurrentSearchAddress(value);
    axios
      .get(process.env.NEXT_PUBLIC_BACKEND_URL + value)
      .then((res) => {
        setCurrentSearchAmount(
          res.data.data?.Amount ? res.data.data.Amount : 0
        );
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const onClaim = async () => {
    axios
      .get(process.env.NEXT_PUBLIC_BACKEND_URL + address)
      .then(async (res) => {
        // setCurrentMyAmount(res.data.data?.Amount ? res.data.data.Amount : 0);
        if (res.data.data?.Amount && res.data.data?.Proof) {
          const amount = res.data.data.Amount;
          const proof: string = res.data.data.Proof;
          const addresses: string[] = proof
            .replace(/[[\]\s]/g, '') // remove brackets and spaces
            .split(',')
            .map((p) => p.trim());
          // console.log(addresses);
          try {
            const tx1Hash = await writeContractAsync({
              abi: CONTRACT_ABI,
              address: process.env
                .NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS as `0x${string}`,
              functionName: 'claim',
              args: [amount, addresses],
            });
            setTxHash(tx1Hash);
            setIsOpen(true);
          } catch (err) {
            alert('error occurred while claiming DOGES');
            throw new Error(err);
          }
        } else {
          // alert('You have already claimed your DOGES');
          setTxHash('0x000');
          setIsOpen(true);
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  React.useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_BACKEND_URL + address)
      .then((res) => {
        setCurrentMyAmount(res.data.data?.Amount ? res.data.data.Amount : 0);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [address]);

  return (
    <main>
      <Head>
        <title>Hi</title>
      </Head>
      <section className='bg-white'>
        <header className='absolute top-2 text-gray-700 w-full'>
          {/* <IconButton icon={Wallet} variant='outline' className='flex-row'>
            Connect Wallet
          </IconButton> */}
          <div className='flex max-w-full justify-end'>
            <appkit-button></appkit-button>
          </div>
        </header>
        <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
          <Logo className='w-16' />
          <h1 className={`mt-4 mb-4 ${status == 'connected' ? 'hidden' : ''}`}>
            Please Connect your walllet
          </h1>
          <div
            className={`mt-2 mb-20 flex ${
              status == 'connected' ? '' : 'hidden'
            }`}
          >
            <p className='text-sm text-gray-800'>
              Congratulations! You have eligible {currentMyAmount} $DOGES to
              claim.
            </p>
            <IconButton variant='outline' className='text-sm' onClick={onClaim}>
              Claim Now
            </IconButton>
          </div>

          {/* <TextInput
            placeholder='Search by Address'
            wrapperClassName='mt-2'
            variant='basic'
          /> */}

          <div className='relative w-[60%]'>
            {/* Fake placeholder icon */}
            {!value && (
              <Search
                size={14}
                className='absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0A0] pointer-events-none'
              />
            )}

            <div className='flex items-center border border-[#E5E5E5] rounded-lg bg-[#f1f1f1] px-2.5 py-[3px] shadow-sm'>
              <input
                type='text'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSearch(); // replace this with your actual function
                  }
                }}
                onChange={(e) => setValue(e.target.value)}
                className='pl-6 flex-grow bg-transparent outline-none border-none focus:ring-0 focus:outline-none focus:border-none text-[13px] font-sans'
                placeholder='Search by Address'
              />
              {value && (
                <>
                  <button
                    onClick={() => setValue('')}
                    className='text-[#A0A0A0] hover:text-gray-600 ml-1'
                  >
                    <X size={14} />
                  </button>
                  <button
                    onClick={onSearch}
                    className='text-[#A0A0A0] hover:text-gray-600 ml-1'
                  >
                    <ArrowRight size={14} />
                  </button>
                </>
              )}
            </div>
          </div>

          <p
            className={`mt-5 text-sm text-gray-700 ${
              isAddress(value) && isAddress(currentSearchAddress)
                ? ''
                : 'hidden'
            }`}
          >
            {currentSearchAddress}
            is eligible to claim {currentSearchAmount} $DOGES
          </p>

          <TransactionModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            txHash={txHash}
            amount={currentMyAmount.toString()}
          />

          <footer className='absolute bottom-2 text-gray-700'>
            © {new Date().getFullYear()} By{' '}
            <UnderlineLink href='https://t.me'>Doges Community</UnderlineLink>
          </footer>
        </div>
      </section>
    </main>
  );
}
