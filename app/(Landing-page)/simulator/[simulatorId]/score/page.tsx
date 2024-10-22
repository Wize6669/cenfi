import ExamScore from '@/components/(Landing-page)/exam/ExamScore';
import { redirect } from 'next/navigation';

export default function ScorePage({ params }: { params: { simulatorId: string } }) {
  // Verificar que el examen se completó y existen resultados
  const verificarFinalizacionExamen = () => {
    const resultadosExamen = localStorage.getItem(`examResults_${params.simulatorId}`);
    if (!resultadosExamen) {
      redirect(`/simulator/${params.simulatorId}/exam`);
    }
  };

  return (
    <div>
      <ExamScore simulatorId={params.simulatorId}
      />
    </div>
  );
}
