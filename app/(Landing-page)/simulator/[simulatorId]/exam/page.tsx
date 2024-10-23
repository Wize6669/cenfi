import ExamInterface from '@/components/(Landing-page)/exam/ExamInterface';
import { Suspense } from 'react';
import Loading from './loading';

export default function ExamPage({ params }: { params: { simulatorId: string } }) {

  return (
    <Suspense fallback={<Loading />}>
      <ExamInterface simulatorId={params.simulatorId}/>
    </Suspense>
  );
}
