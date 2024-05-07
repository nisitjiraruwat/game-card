/* eslint-disable @next/next/no-img-element */

export default function Loading () {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <img
        className="animate-spin"
        src='/images/loading.svg'
        alt=''
      />
    </div>
  )
}