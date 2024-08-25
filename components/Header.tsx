'use client';

import Image from "next/image";
import DropDownProfile from "@/components/DropDownProle/DropDownProfile";
import './DropDownProle/DropDownProfile.css';
import {useState} from "react";
import { FaUser } from "react-icons/fa";
import {useAuthStore} from "@/store/auth";
import { IoMdArrowDropdown } from "react-icons/io";


export default function Header() {
  const [openDropDownProfile, setOpenDropDownProfile] = useState(false);
  const userAuth = useAuthStore((state) => state.userAuth);

  return (
    <div className={'container mx-auto py-3 flex justify-between items-center'}>
      <div className={'w-1/4'}>
        <Image src={'/images/image-1.png'} alt={'Icon'} width={75} height={60} />
      </div>

      <div className={'w-1/2'}>

      </div>

      <div>
        <div className={'flex justify-center px-3.5 items-center gap-3 border-2 rounded-md relative'}
             onClick={() => setOpenDropDownProfile((prev) => !prev)}>
          <FaUser/><p>{userAuth && userAuth.name} {userAuth && userAuth.lastName}</p><IoMdArrowDropdown/>
        </div>
        {openDropDownProfile && <DropDownProfile/>}
      </div>
    </div>);
}
