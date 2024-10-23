import ExamReview from '@/components/(Landing-page)/exam/ExamReview';

export default function ReviewPage({ params }: { params: { simulatorId: string } }) {
  return (
    <div>
      <ExamReview simulatorId={params.simulatorId}
      />
    </div>
  );
}
