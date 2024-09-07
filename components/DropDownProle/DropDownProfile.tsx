'use client';

import React, {useState} from "react";
import {useRouter} from "next/navigation";

export default function DropDownProfile() {
  const router = useRouter();

  const handleLogOut = (event: React.MouseEvent<HTMLLIElement>) => {
    localStorage.clear();

    router.replace('/admin');
  }

  const handleMenu = (event: React.MouseEvent<HTMLLIElement>) => {

  }

  return (
    <div className={'dropDownProfile'}>
      <ol className={'flex flex-col justy text-center'}>
        <li onClick={handleMenu} className={'cursor-pointer hover:opacity-50'}>Menu</li>
        <li onClick={handleLogOut} className={'cursor-pointer hover:opacity-50'}>Log Out</li>
      </ol>
    </div>
  );
}
