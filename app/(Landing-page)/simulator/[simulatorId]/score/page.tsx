import ExamScore from '@/components/(Landing-page)/exam/ExamScore';

export default function ScorePage({ params }: { params: { simulatorId: string } }) {

  return (
    <div>
      <ExamScore simulatorId={params.simulatorId}
      />
    </div>
  );
}
