import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ModuleListCards from '@/components/ModulesList/ModuleListCards';

export default function Menu() {

  return (<div className={'flex flex-col min-h-screen dark:bg-gray-800'}>
    <Header>
      <></>
    </Header>
    <div className={'flex-grow flex justify-center items-center'}>
      <ModuleListCards/>
    </div>

    <Footer/>
  </div>);
}
