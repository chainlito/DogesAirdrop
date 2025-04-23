'use client';

import { Wallet } from 'lucide-react';
import Head from 'next/head';
import * as React from 'react';
import '@/lib/env';

import IconButton from '@/components/buttons/IconButton';
import TextInput from '@/components/input/TextInput';
import UnderlineLink from '@/components/links/UnderlineLink';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
import Logo from '~/svg/Logo.svg';

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  return (
    <main>
      <Head>
        <title>Hi</title>
      </Head>
      <section className='bg-white'>
        <header className='absolute top-2 text-gray-700'>
          <IconButton icon={Wallet} variant='outline' className='flex-row'>
            Connect Wallet
          </IconButton>
        </header>
        <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
          <Logo className='w-16' />
          <h1 className='mt-4'></h1>
          <div className='mt-2 mb-20 flex'>
            <p className='text-sm text-gray-800'>
              Congratulations! You have eligible 10,000 $DOGES to claim.
            </p>
            <IconButton variant='outline' className='text-sm'>
              Claim Now
            </IconButton>
          </div>

          <TextInput
            placeholder='Search by Address'
            wrapperClassName='mt-2'
            variant='basic'
          />
          <p className='mt-5 text-sm text-gray-700'>
            Address 0xfe0BF3Cd3A12e88BAb776b4c82F158904ED4f6A4 is eligible to
            claim 0 $DOGES
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
