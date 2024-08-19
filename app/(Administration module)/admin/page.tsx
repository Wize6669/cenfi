import Image from 'next/image';
import Footer from "@/components/Footer";

export default function LoginAdmin() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow flex flex-col justify-center items-center">
                <div className="flex flex-row justify-center items-center w-full">
                    <div className="w-1/2 flex flex-col justify-center items-center">
                        <div className="mb-10">
                            <Image src={'/images/image-1.png'} alt={'Logo de CENFI'} width={260} height={190}/>
                        </div>

                        <form className="w-full max-w-sm">
                            <div className="flex flex-col justify-start mb-8 text-center">
                                <h1 className="text-3xl font-medium">¡Bienvenido de nuevo!</h1>
                                <p className="text-base font-medium">Ingresa tus credenciales para iniciar sesión</p>
                            </div>

                            <div className="flex flex-col mb-3">
                                <label className="text-sm font-medium" htmlFor={'email'}>Correo electrónico</label>
                                <input className="border rounded-md p-2"
                                       type="email"
                                       placeholder="Ingresa tu email"
                                       name="email"
                                       required={true}/>
                            </div>

                            <div className="flex flex-col mb-3">
                                <label className="text-sm font-medium" htmlFor={'password'}>Contraseña</label>
                                <input className="border rounded-md p-2"
                                       type="password"
                                       placeholder="Ingresa tu contraseña"
                                       name="password"
                                       required={true}/>
                            </div>

                            <div className="flex flex-col mb-3 w-1/2">
                                <label className="text-sm font-medium" htmlFor={'roleId'}>Rol</label>
                                <select className="border rounded-md w-full p-2" name="roleId" required={true}>
                                    <option value="">Selecciona tu rol</option>
                                </select>
                            </div>

                            <div className="flex gap-1 mb-3 items-center">
                                <input type="checkbox" name="isRemembered" id="isRemembered"/>
                                <label className="text-xs font-medium" htmlFor="isRemembered">Recuérdame por 30
                                    días</label>
                            </div>

                            <button type='submit'
                                    className="text-white text-sm font-bold w-full bg-[#627BCF] border rounded-md p-2">
                                Iniciar sesión
                            </button>
                        </form>
                    </div>
                    <div className="w-1/2 flex justify-center items-center">
                        <Image src={'/images/image-2.png'} alt={'Icono'} width={555} height={619}/>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    );
}
