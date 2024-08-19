import {FaTiktok, FaFacebookF, FaInstagram, FaWhatsapp} from "react-icons/fa";
import Link from "next/link";

export default function Footer() {

    return (
        <footer className={'container mx-auto py-3 flex justify-between items-center'}>
            <div><p className={'text-sm font-medium'}>W.F.S.A</p></div>
            <div><p className={'text-sm font-medium'}>© 2024 Todos los derechos reservados | Preuniversitario CENFI |
                Loja - Ecuador</p></div>
            <div className={'flex justify-between items-center gap-3'}>
                <Link className={'border rounded-3xl p-1.5'}
                      href={"https://www.tiktok.com/@preuniversitario.cenfi?_t=8ocuteZQ73G&_r=1"}>
                    <FaTiktok width={45} height={45}/>
                </Link>
                <Link className={'border rounded-3xl p-1.5'}
                      href={"https://www.facebook.com/share/3xgwpWEhGxW4kViB/?mibextid=qi2Omg"}>
                    <FaFacebookF width={45} height={45}/>
                </Link>
                <Link className={'border rounded-3xl p-1.5'}
                      href={"https://www.instagram.com/preuniversitario_cenfi?igsh=MTVyZ2c1cnQzNXR3dw=="}>
                    <FaInstagram width={45} height={45}/>
                </Link>
                <Link className={'border rounded-3xl p-1.5'}
                      href={"https://api.whatsapp.com/send/?phone=593992562952&text&type=phone_number&app_absent=0"}>
                    <FaWhatsapp width={45} height={45}/>
                </Link>
            </div>
        </footer>
    )
}
