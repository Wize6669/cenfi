'use client';

export default function DropDownProfile() {

  return (
    <div className={'flex flex-col dropDownProfile'}>
      <ol className={'flex flex-col gap-0.5'}>
        <li className={'cursor-pointer'}>Menu</li>
        <li className={'cursor-pointer'}>Logout</li>
      </ol>
    </div>
  );
}
