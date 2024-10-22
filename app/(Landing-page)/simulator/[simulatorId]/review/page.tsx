import ExamReview from '@/components/(Landing-page)/exam/ExamReview';
import { redirect } from 'next/navigation';

export default function ReviewPage({ params }: { params: { simulatorId: string } }) {
  // Verificar si la revisión está disponible
  const verificarDisponibilidadRevision = () => {
    const resultadosExamen = localStorage.getItem(`examResults_${params.simulatorId}`);
    const revisionHabilitada = localStorage.getItem(`reviewEnabled_${params.simulatorId}`);

    if (!resultadosExamen || revisionHabilitada !== 'true') {
      redirect(`/simulator/${params.simulatorId}/score`);
    }
  };

  return (
    <div>
      <ExamReview simulatorId={params.simulatorId}
      />
    </div>
  );
}
