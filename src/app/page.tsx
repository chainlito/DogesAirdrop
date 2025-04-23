'use client';

import axios from 'axios';
import dotenv from 'dotenv';
import { ArrowRight, Search, X } from 'lucide-react';
import Head from 'next/head';
import * as React from 'react';

// import '@/lib/env';
import IconButton from '@/components/buttons/IconButton';
import UnderlineLink from '@/components/links/UnderlineLink';

dotenv.config();
/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';

import Logo from '~/svg/Logo.svg';

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  /*  const { account, isConnected, caipAddress, status, embeddedWalletInfo } =
    useAppKitAccount(); */
  const { status } = useAccount();
  const [value, setValue] = React.useState('');
  const [currentAmount, setCurrentAmount] = React.useState(0);

  const onSearch = () => {
    if (isAddress(value) === false) {
      return;
    }
    axios
      .get(process.env.NEXT_PUBLIC_BACKEND_URL + value)
      .then((res) => {
        setCurrentAmount(res.data.data?.amount ? res.data.data.amount : 0);
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  return (
    <main>
      <Head>
        <title>Hi</title>
      </Head>
      <section className='bg-white'>
        <header className='absolute top-2 text-gray-700'>
          {/* <IconButton icon={Wallet} variant='outline' className='flex-row'>
            Connect Wallet
          </IconButton> */}
          <appkit-button></appkit-button>
        </header>
        <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
          <Logo className='w-16' />
          <h1 className={`mt-4 ${status == 'connected' ? 'hidden' : ''}`}>
            Please Connect your walllet
          </h1>
          <div className='mt-2 mb-20 flex'>
            <p className='text-sm text-gray-800'>
              Congratulations! You have eligible {currentAmount} $DOGES to
              claim.
            </p>
            <IconButton variant='outline' className='text-sm'>
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
                value={value}
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

          <p className='mt-5 text-sm text-gray-700'>
            Address{' '}
            {isAddress(value)
              ? value
              : '0xfe0BF3Cd3A12e88BAb776b4c82F158904ED4f6A4'}{' '}
            is eligible to claim {currentAmount} $DOGES
          </p>

          <footer className='absolute bottom-2 text-gray-700'>
            © {new Date().getFullYear()} By{' '}
            <UnderlineLink href='https://t.me'>Doges Community</UnderlineLink>
          </footer>
        </div>
      </section>
    </main>
  );
}
