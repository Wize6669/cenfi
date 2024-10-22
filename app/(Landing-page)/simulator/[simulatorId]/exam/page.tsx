import ExamInterface from '@/components/(Landing-page)/exam/ExamInterface';
import { redirect } from 'next/navigation';

export default function ExamPage({ params }: { params: { simulatorId: string } }) {
  // Verificación de autenticación del lado del cliente
  const verificarAutenticacion = () => {
    const authToken = localStorage.getItem('authToken');
    const currentSimulatorId = localStorage.getItem('currentSimulatorId');

    // Si no hay token o el simulador no coincide, redirigir al inicio
    if (!authToken || currentSimulatorId !== params.simulatorId) {
      redirect(`/simulator/${params.simulatorId}`);
    }
  };

  return (
    <div>
      <ExamInterface simulatorId={params.simulatorId}/>
    </div>
  );
}
