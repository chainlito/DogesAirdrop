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
import Image from 'next/image';
import { isAddress } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';

import TransactionModal from '@/components/modal/TransactionModal';

import Dog from '~/images/dog.png';
import Money1 from '~/images/money1.png';
import Money2 from '~/images/money2.png';
import Grass from '~/svg/grass.png';
import Logo from '~/svg/Logo.png';

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
                .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
              functionName: 'claim',
              args: [amount, addresses],
            });
            setTxHash(tx1Hash);
            setIsOpen(true);
          } catch (err) {
            alert('error occurred while claiming DOGES');
            throw new Error(String(err));
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
        <title>$DOGES Airdrop For Shibes</title>
      </Head>
      <section className='bg-white'>
        <div className=' relative flex h-screen flex-col items-center justify-center py-12 text-center bg-[#F0EFE8]'>
          <div className='  absolute top-0 left-0 w-full h-[60%]  z-0'>
            <header className=' absolute top-2 text-gray-700 w-full flex '>
              {/* <IconButton icon={Wallet} variant='outline' className='flex-row'>
            Connect Wallet
          </IconButton> */}
              <div className=' w-10 ml-[10%] sm:ml-[5%] mt-[1%] flex flex-row items-center justify-center'>
                <Image src={Logo} alt='Logo' />
                <span className='font-slacky text-center text-sm sm:text-md md:text-lg'>
                  $DOGES
                </span>
              </div>
              <div className='  flex w-full justify-end'>
                <appkit-button></appkit-button>
              </div>
            </header>
          </div>

          {/* Bottom Half - Background Image */}
          <div
            className='absolute bottom-0 left-0 w-full h-[40%] bg-cover bg-center z-0'
            style={{
              backgroundImage: `url(${Grass.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Content on top (optional) */}
          <div className=' relative flex items-center justify-center py-12 text-center bg-transparent min-h-[90vh]  h-[70%] z-0 w-full'>
            <div className='h-[70%] w-[15%] z-9'>
              <Image
                className='mt-[70%] sm:mt-[80%] md:mt-[90%] ml-[30%] sm:ml-[40%] md:gl-[42%] xl:ml-[47%]'
                src={Dog}
                alt='dog'
              ></Image>
              <Image
                className='mt-[30%] sm:mt-[10%] md:mt-[-30%] ml-[30%] sm:ml-[40%] md:gl-[42%] xl:ml-[47%]'
                src={Money1}
                alt='dog'
              ></Image>
            </div>
            <div className='relative flex flex-col items-center justify-center py-12 text-center bg-white !h-[70%] rounded-xl shadow-lg z-10 w-[70%]'>
              <h1
                className={`font-slacky mt-4 mb-4 ${
                  status == 'connected' ? 'hidden' : ''
                }`}
              >
                Please Connect your walllet
              </h1>
              <div
                className={`mt-2 mb-20 ${
                  status == 'connected' ? '' : 'hidden'
                }`}
              >
                <div className='ml-[35%] w-[30%] mb-8 font-satoshi border-2 p-2 rounded-full border-gray-300 font-bold'>
                  $DOGES Airdrop
                </div>
                <div className='font-slacky text-[60px]'>Congratulations!</div>
                <div className='flex place-content-center justify-items-center mt-4'>
                  <p className='text-sm text-gray-800 mt-2'>
                    You have eligible {currentMyAmount} $DOGES to claim.
                  </p>
                  <IconButton
                    variant='outline'
                    className='text-sm bg-[#95B943] text-black border-black rounded-full ml-4'
                    onClick={onClaim}
                  >
                    Claim Now
                  </IconButton>
                </div>
              </div>

              <div className='relative w-[60%]'>
                {/* Fake placeholder icon */}
                {!value && (
                  <Search
                    size={14}
                    className='absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0A0] pointer-events-none'
                  />
                )}

                <div className='flex items-center border border-[#E5E5E5] bg-[#F1F5FF] rounded-lg  px-2.5 py-[3px] shadow-sm'>
                  <input
                    type='text'
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onSearch(); // replace this with your actual function
                      }
                    }}
                    onChange={(e) => setValue(e.target.value)}
                    className='font-satoshi bg-[#F1F4FE] border-black rounded-3xl  pl-6 flex-grow bg-transparent outline-none border-none focus:ring-0 focus:outline-none focus:border-none text-[13px] font-sans'
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

              <footer className='font-satoshi absolute bottom-2 text-gray-700'>
                © {new Date().getFullYear()} By{' '}
                <UnderlineLink href='https://t.me'>
                  Doges Community
                </UnderlineLink>
              </footer>
            </div>
            <div className='h-[70%] w-[15%] z-1000'>
              <Image
                className='ml-[-30%] z-1000'
                src={Money2}
                alt='dog'
              ></Image>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
