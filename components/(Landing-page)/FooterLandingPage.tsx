'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import {FaTiktok, FaFacebook, FaInstagram} from "react-icons/fa";

export default function Footer() {

  return (
    <footer className={'bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900'}>
      <div className={'max-w-full mx-auto px-4 sm:px-6 lg:px-40 py-12'}> {/*max-w-7xl px-8*/}
        <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'}>
          <div className={'space-y-4'}>
            <h3 className={'text-2xl font-bold text-blue-600 dark:text-blue-500'}>CENFI</h3>
            <p className={'text-sm text-gray-600 dark:text-gray-300'}>
              Preparándote para el éxito universitario desde 2018.
            </p>
            <div className={'flex space-x-4'}>
              {[
                {icon: FaFacebook, href: 'https://www.facebook.com/share/3xgwpWEhGxW4kViB/?mibextid=qi2Omg'},
                {icon: FaInstagram, href: 'https://www.instagram.com/preuniversitario_cenfi?igsh=MTVyZ2c1cnQzNXR3dw=='},
                {icon: FaTiktok, href: 'https://www.tiktok.com/@preuniversitario.cenfi?_t=8ocuteZQ73G&_r=1'},
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={'text-gray-400 hover:text-blue-500 transition-colors dark:text-gray-500 dark:hover:text-blue-400'}
                  target={'_blank'}
                  rel={'noopener noreferrer'}
                >
                  <social.icon className={'w-5 h-5'}/>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className={'text-lg font-semibold mb-4 text-gray-800 dark:text-blue-300'}>Enlaces Rápidos</h4>
            <ul className={'space-y-2'}>
              <li>
                <Link href="/"
                      className={'text-sm text-gray-600 hover:text-blue-500 transition-colors dark:text-gray-300 dark:hover:text-blue-400'}>
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/course"
                      className={'text-sm text-gray-600 hover:text-blue-500 transition-colors dark:text-gray-300 dark:hover:text-blue-400'}>
                  Cursos
                </Link>
              </li>
              <li>
                <Link href="/contact"
                      className={'text-sm text-gray-600 hover:text-blue-500 transition-colors dark:text-gray-300 dark:hover:text-blue-400'}>
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/about"
                      className={'text-sm text-gray-600 hover:text-blue-500 transition-colors dark:text-gray-300 dark:hover:text-blue-400'}>
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link href="/simulator"
                      className={'text-sm text-gray-600 hover:text-blue-500 transition-colors dark:text-gray-300 dark:hover:text-blue-400'}>
                  Simuladores
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={'text-lg font-semibold mb-4 text-gray-800 dark:text-blue-300'}>Contacto</h4>
            <ul className={'space-y-2'}>
              <li className={'flex items-center text-sm text-gray-600 dark:text-gray-300'}>
                <Mail className={'w-4 h-4 mr-2 text-blue-500 dark:text-blue-400'}/>
                cenfilojaecuador@gmail.com
              </li>
              <li className={'flex items-center text-sm text-gray-600 dark:text-gray-300'}>
                <Phone className={'w-4 h-4 mr-2 text-blue-500 dark:text-blue-400'}/>
                (+593) 99 256 2952
              </li>
              <li className={'flex items-center text-sm text-gray-600 dark:text-gray-300'}>
                <MapPin className={'w-4 h-4 mr-2 text-blue-500 dark:text-blue-400'}/>
                Loja, Ecuador
              </li>
            </ul>
          </div>
          <div>
            <h4 className={'text-lg font-semibold mb-4 text-gray-800 dark:text-blue-300'}>Horario de Atención</h4>
            <ul className={'space-y-2 text-sm text-gray-600 dark:text-gray-300'}>
              <li>Lunes a Viernes: 8:00 AM - 6:00 PM</li>
              <li>Sábados: 9:00 AM - 1:00 PM</li>
              <li>Domingos: Cerrado</li>
            </ul>
          </div>
        </div>
        <div
          className={'mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center'}>
          <p className={'text-sm text-gray-500 dark:text-gray-400'}>
            © {new Date().getFullYear()} CENFI. Todos los derechos reservados.
          </p>
          <p className={'text-sm text-gray-500 mt-2 md:mt-0 dark:text-gray-400'}>
            Diseñado y desarrollado por <a href={'#'} className={'text-blue-500 hover:underline dark:text-blue-400'}>Francisco
            Rodríguez y William Zapata</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
